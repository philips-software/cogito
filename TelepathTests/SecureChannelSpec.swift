//Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
import RNCryptor
@testable import Telepath

class SecureChannelSpec: QuickSpec {
    override func spec() {
        let channelId: QueueID = "channel_id"
        let channelKeys = ChannelKeys.example()

        var channel: SecureChannel!
        var queuing: QueuingServiceMock!

        beforeEach {
            queuing = QueuingServiceMock()
            channel = SecureChannel(queuing: queuing, id: channelId, keys: channelKeys)
        }

        context("when sending a message") {
            let message = "a message"

            beforeEach {
                try! channel.send(message: "a message")
            }

            it("encrypts the message") {
                let cypherText = queuing.latestSentMessage!
                let plainText = try! channelKeys.decrypt(cypherText: cypherText)
                expect(String(data: plainText, encoding: .utf8)) == message
            }

            it("it uses the blue queue") {
                expect(queuing.latestQueueId) == channelId + ".blue"
            }
        }

        context("when receiving a message") {
            let message = "a message"

            var receivedMessage: String?

            beforeEach {
                let plainText = message.data(using: .utf8)!
                let cypherText = channelKeys.encrypt(plainText: plainText)
                queuing.messageToReturn = cypherText
                try! receivedMessage = channel.receive()
            }

            it("decrypts the message") {
                expect(receivedMessage) == message
            }

            it("uses the red queue") {
                expect(queuing.latestQueueId) == channelId + ".red"
            }
        }

        it("indicates when no message is available") {
            queuing.messageToReturn = nil
            expect(try! channel.receive()).to(beNil())
        }

        it("throws when there's an error while sending") {
            struct SomeError: Error {}
            queuing.sendError = SomeError()
            expect { try channel.send(message: "some message") }.to(throwError())
        }

        it("throws when there's an error while receiving") {
            struct SomeError: Error {}
            queuing.receiveError = SomeError()
            expect { try channel.receive() }.to(throwError())
        }

        it("throws when there's an error while decrypting") {
            queuing.messageToReturn = "invalid data".data(using: .utf8)
            expect { try channel.receive() }.to(throwError())
        }
    }
}

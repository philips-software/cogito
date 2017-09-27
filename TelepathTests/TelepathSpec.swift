//  Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
import RNCryptor
@testable import Telepath

class TelepathSpec: QuickSpec {
    override func spec() {
        var telepath: Telepath!
        var queue: QueuingServiceMock!

        beforeEach {
            queue = QueuingServiceMock()
            telepath = Telepath(queue: queue)
        }

        context("when a secure channel is opened") {
            let channelId: QueueID = "channel_id"
            let channelKeys = ChannelKeys(
                encryptionKey: RNCryptor.randomData(ofLength: 32),
                hmacKey: RNCryptor.randomData(ofLength: 32)
            )

            var channel: SecureChannel!

            beforeEach {
                channel = telepath.connect(channel: channelId, keys: channelKeys)
            }

            context("when sending a message") {
                let message = "a message"

                beforeEach {
                    try! channel.send(message: "a message")
                }

                it("encrypts the message") {
                    let cypherText = queue.latestSentMessage!
                    let plainText = try! channelKeys.decrypt(cypherText: cypherText)
                    expect(String(data: plainText, encoding: .utf8)) == message
                }

                it("it uses the blue queue") {
                    expect(queue.latestQueueId) == channelId + ".blue"
                }
            }

            context("when receiving a message") {
                let message = "a message"

                var receivedMessage: String?

                beforeEach {
                    let plainText = message.data(using: .utf8)!
                    let cypherText = channelKeys.encrypt(plainText: plainText)
                    queue.messageToReturn = cypherText
                    try! receivedMessage = channel.receive()
                }

                it("decrypts the message") {
                    expect(receivedMessage) == message
                }

                it("uses the red queue") {
                    expect(queue.latestQueueId) == channelId + ".red"
                }
            }

            it("indicates when no message is available") {
                queue.messageToReturn = nil
                expect(try! channel.receive()).to(beNil())
            }

            it("throws when there's an error while sending") {
                struct SomeError : Error {}
                queue.sendError = SomeError()
                expect { try channel.send(message: "some message") }.to(throwError())
            }

            it("throws when there's an error while receiving") {
                struct SomeError : Error {}
                queue.receiveError = SomeError()
                expect { try channel.receive() }.to(throwError())
            }

            it("throws when there's an error while decrypting") {
                queue.messageToReturn = "invalid data".data(using: .utf8)
                expect { try channel.receive() }.to(throwError())
            }
        }
    }
}

class QueuingServiceMock: QueuingService {
    var latestQueueId: QueueID?
    var latestSentMessage: Data?

    var messageToReturn: Data?
    var sendError: Error?
    var receiveError: Error?

    func send(queueId: QueueID, message: Data) throws {
        if let error = sendError {
            throw error
        }
        latestQueueId = queueId
        latestSentMessage = message
    }

    func receive(queueId: QueueID) throws -> Data? {
        if let error = receiveError {
            throw error
        }
        latestQueueId = queueId
        return messageToReturn
    }
}

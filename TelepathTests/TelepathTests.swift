//  Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
import RNCryptor
@testable import Telepath

class TelepathTests: QuickSpec {
    override func spec() {
        var telepath: Telepath!
        var queue: QueuingServiceMock!

        beforeEach {
            queue = QueuingServiceMock()
            telepath = Telepath(queue: queue)
        }

        context("when a secure channel is opened") {
            let channelId: QueueID = "channel id"
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

                it("it uses the correct queue") {
                    expect(queue.latestQueueId) == channelId
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

                it("uses the correct queue") {
                    expect(queue.latestQueueId) == channelId
                }
            }

            it("indicates when no message is available") {
                queue.messageToReturn = nil
                expect(try! channel.receive()).to(beNil())
            }
        }
    }
}

class QueuingServiceMock: QueuingService {
    var latestQueueId: QueueID?
    var latestSentMessage: Data?

    var messageToReturn: Data?

    func send(queueId: QueueID, message: Data) throws {
        latestQueueId = queueId
        latestSentMessage = message
    }

    func receive(queueId: QueueID) throws -> Data? {
        latestQueueId = queueId
        return messageToReturn
    }
}

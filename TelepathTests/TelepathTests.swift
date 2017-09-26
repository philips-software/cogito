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
            let channelId: UInt64 = 42
            let channelKeys = ChannelKeys(
                encryptionKey: RNCryptor.randomData(ofLength: 32),
                hmacKey: RNCryptor.randomData(ofLength: 32)
            )

            var channel: SecureChannel!

            beforeEach {
                channel = telepath.openSecureChannel(id: channelId, keys: channelKeys)
            }

            it("sends a message") {
                try! channel.send(message: "a message")
                let cypherText = queue.latestSentMessage!
                let plainText = try! channelKeys.decrypt(cypherText: cypherText)
                expect(String(data: plainText, encoding: .utf8)) == "a message"
                expect(queue.latestQueueId) == channelId
            }
        }
    }
}

class QueuingServiceMock: QueuingService {
    var latestQueueId: UInt64?
    var latestSentMessage: Data?

    func createQueue(id: UInt64) {

    }

    func send(queueId: UInt64, message: Data) throws {
        latestQueueId = queueId
        latestSentMessage = message
    }

    func receive(queueId: UInt64) throws -> Data? {
        return nil
    }
}

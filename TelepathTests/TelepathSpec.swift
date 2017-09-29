//Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
import RNCryptor
@testable import Telepath

class TelepathSpec: QuickSpec {
    override func spec() {
        let channelId: QueueID = "channel_id"
        let encryptionKey = RNCryptor.randomData(ofLength: 32)
        let hmacKey = RNCryptor.randomData(ofLength: 32)
        let channelKeys = ChannelKeys(encryptionKey: encryptionKey, hmacKey: hmacKey)

        var telepath: Telepath!
        var queuing: QueuingServiceMock!

        beforeEach {
            queuing = QueuingServiceMock()
            telepath = Telepath(queuing: queuing)
        }

        it("can open a channel using a channel id and keys") {
            let channel = telepath.connect(channel: channelId, keys: channelKeys)
            expect(channel.id) == channelId
            expect(channel.keys) == channelKeys
        }

        it("can open a channel using a telepath URL") {
            let url = UrlCodec().encode(
                scheme: "scheme",
                channelId: channelId,
                keys: channelKeys
            )
            let channel = try! telepath.connect(url: url)
            expect(channel.id) == channelId
            expect(channel.keys) == channelKeys
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

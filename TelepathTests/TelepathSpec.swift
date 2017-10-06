//Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
@testable import Telepath

class TelepathSpec: QuickSpec {
    override func spec() {
        let channelId: QueueID = "channel_id"
        let channelKey = ChannelKey.example()

        var telepath: Telepath!
        var queuing: QueuingServiceMock!

        beforeEach {
            queuing = QueuingServiceMock()
            telepath = Telepath(queuing: queuing)
        }

        it("can open a channel using a channel id and key") {
            let channel = telepath.connect(channel: channelId, key: channelKey)
            expect(channel.id) == channelId
            expect(channel.key) == channelKey
        }

        it("can open a channel using a telepath URL") {
            let url = UrlCodec().encode(
                baseUrl: URL(string: "https://example.com")!,
                channelId: channelId,
                key: channelKey
            )
            let channel = try! telepath.connect(url: url)
            expect(channel.id) == channelId
            expect(channel.key) == channelKey
        }
    }
}

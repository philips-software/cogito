//Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
@testable import Telepath

class TelepathSpec: QuickSpec {
    override func spec() {
        let channelId: QueueID = "channel_id"
        let channelKeys = ChannelKeys.example()

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
                baseUrl: URL(string: "https://example.com")!,
                channelId: channelId,
                keys: channelKeys
            )
            let channel = try! telepath.connect(url: url)
            expect(channel.id) == channelId
            expect(channel.keys) == channelKeys
        }
    }
}

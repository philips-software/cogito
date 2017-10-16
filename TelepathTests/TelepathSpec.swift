//Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
@testable import Telepath

class TelepathSpec: QuickSpec {
    override func spec() {
        let channelId: QueueID = "channel_id"
        let channelKey = ChannelKey.example()
        let queuingServiceUrl = "https://queuing.example.com"
        var telepath: Telepath!

        beforeEach {
            telepath = Telepath(queuingServiceUrl: queuingServiceUrl)
        }

        it("connects to the correct queuing service") {
            expect(telepath.queuing as? QueuingServiceClient).toNot(beNil())
            expect((telepath.queuing as? QueuingServiceClient)?.url) == queuingServiceUrl
        }

        it("can open a channel using a channel id and key") {
            let channel = telepath.connect(channel: channelId, key: channelKey)
            expect(channel.id) == channelId
            expect(channel.key) == channelKey
        }

        it("can open a channel using a telepath connection URL") {
            let connectionUrl = UrlCodec().encode(
                baseUrl: URL(string: "https://example.com")!,
                channelId: channelId,
                key: channelKey
            )
            let channel = try! telepath.connect(url: connectionUrl)
            expect(channel.id) == channelId
            expect(channel.key) == channelKey
        }
    }
}

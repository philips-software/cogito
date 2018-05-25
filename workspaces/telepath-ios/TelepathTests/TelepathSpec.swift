//Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
@testable import Telepath

class TelepathSpec: QuickSpec {
    override func spec() {
        let channelId: QueueID = "channel_id"
        let channelKey = ChannelKey.example()
        let appName = "example"
        let queuingServiceUrl = URL(string: "https://queuing.example.com")!
        var telepath: Telepath!

        beforeEach {
            telepath = Telepath(queuingServiceUrl: queuingServiceUrl)
        }

        it("connects to the correct queuing service") {
            let queuing = telepath.queuing as? QueuingServiceClient
            expect(queuing).toNot(beNil())
            expect(queuing?.url) == queuingServiceUrl
        }

        it("can open a channel using a channel id and key") {
            let channel = telepath.connect(channel: channelId, key: channelKey, appName: appName)
            expect(channel.id) == channelId
            expect(channel.key) == channelKey
            expect(channel.appName) == appName
        }

        it("can open a channel using a telepath connection URL") {
            let connectionUrl = UrlCodec().encode(
                baseUrl: URL(string: "https://example.com")!,
                channelId: channelId,
                key: channelKey,
                appName: appName
            )
            let channel = try! telepath.connect(url: connectionUrl)
            expect(channel.id) == channelId
            expect(channel.key) == channelKey
            expect(channel.appName) == appName
        }
    }
}

//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
@testable import Cogito

class TelepathChannelSpec: QuickSpec {
    override func spec() {
        let connectUrl = URL(string: "http://example.com/telepath/connect#I=1234&E=abcd")!

        var channel: TelepathChannel!

        beforeEach {
            channel = try? TelepathChannel(connectUrl: connectUrl)
        }

        it("encapsulates a secure channel") {
            expect(channel.channel).toNot(beNil())
        }

        it("throws when connect url is invalid") {
            expect {
                try TelepathChannel(connectUrl: URL(string: "http://invalid.connect.url")!)
            }.to(throwError())
        }

        it("can be encoded") {
            let encoded = try? JSONEncoder().encode(channel)
            expect(encoded).toNot(beNil())
        }

        it("can be decoded") {
            let encoded = try? JSONEncoder().encode(channel)
            let decoded = try? JSONDecoder().decode(TelepathChannel.self, from: encoded!)
            expect(decoded) == channel
        }
    }
}

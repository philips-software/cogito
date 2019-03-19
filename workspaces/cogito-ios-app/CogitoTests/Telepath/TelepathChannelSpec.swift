import Quick
import Nimble
@testable import Cogito

class TelepathChannelSpec: QuickSpec {
    override func spec() {
        let connectUrl = URL(string: "http://example.com/telepath/connect#I=1234&E=abcd&A=QQ")!

        var channel: TelepathChannel!

        beforeEach {
            TelepathChannel.startMocking()
            channel = TelepathChannel(connectUrl: connectUrl)
            channel.connect(completion: nil)
        }

        afterEach {
            TelepathChannel.stopMocking()
        }

        it("encapsulates a secure channel") {
            expect(channel.channel).toNot(beNil())
        }

        it("errors when connect url is invalid") {
            let channel = TelepathChannel(connectUrl: URL(string: "http://invalid.connect.url")!)
            var raisedError: Error?
            channel.connect { error in
                raisedError = error
            }
            expect(raisedError).toEventuallyNot(beNil())
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

        it("is connected after being decoded") {
            let encoded = try? JSONEncoder().encode(channel)
            let decoded = try? JSONDecoder().decode(TelepathChannel.self, from: encoded!)
            expect(decoded?.channel).toNot(beNil())
        }
    }
}

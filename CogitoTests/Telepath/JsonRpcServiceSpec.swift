//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class JsonRpcServiceSpec: QuickSpec {
    override func spec() {
        var service: TestableJsonRpcService!

        beforeEach {
            service = TestableJsonRpcService(store: StoreSpy(), method: "test")
        }

        describe("parsing of incoming JSON RPC requests") {
            let message = "{" +
                "\"jsonrpc\":\"2.0\"," +
                "\"id\":42," +
                "\"method\":\"test\"" +
            "}"

            it("parses the method") {
                service.onMessage(message)
                expect(service.latestRequest?.method) == "test"
            }

            it("parses a numeric id") {
                service.onMessage(message)
                expect(service.latestRequest?.id?.number) == 42
            }

            it("parses a string id") {
                let message = "{" +
                    "\"jsonrpc\":\"2.0\"," +
                    "\"id\":\"test id\"," +
                    "\"method\":\"test\"" +
                "}"
                service.onMessage(message)
                expect(service.latestRequest?.id?.string) == "test id"
            }
        }
    }
}

class TestableJsonRpcService: JsonRpcService {
    var latestRequest: JsonRpcRequest?

    override func onRequest(_ request: JsonRpcRequest) {
        latestRequest = request
    }
}

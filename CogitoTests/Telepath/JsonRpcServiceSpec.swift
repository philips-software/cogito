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
        }
    }
}

class TestableJsonRpcService: JsonRpcService {
    var latestRequest: JsonRpcRequest?

    override func onRequest(_ request: JsonRpcRequest) {
        latestRequest = request
    }
}

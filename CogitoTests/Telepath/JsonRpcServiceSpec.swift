//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class JsonRpcServiceSpec: QuickSpec {
    override func spec() {
        var service: TestableJsonRpcService!

        beforeEach {
            service = TestableJsonRpcService(store: StoreSpy(), method: "test")
        }

        it("parses an incoming JSON RPC request") {
            let message = "{" +
                "\"jsonrpc\":\"2.0\"," +
                "\"id\":42," +
                "\"method\":\"test\"" +
            "}"
            service.onMessage(message)
            expect(service.latestRequest) == JsonRpcRequest(parse: message)
        }
    }
}

class TestableJsonRpcService: JsonRpcService {
    var latestRequest: JsonRpcRequest?

    override func onRequest(_ request: JsonRpcRequest) {
        latestRequest = request
    }
}

//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class JsonRpcRequestSpec: QuickSpec {
    override func spec() {
        let json = "{" +
            "\"jsonrpc\":\"2.0\"," +
            "\"id\":42," +
            "\"method\":\"test\"" +
        "}"

        it("parses the method") {
            let request = JsonRpcRequest(parse: json)
            expect(request?.method) == "test"
        }

        it("parses a numeric id") {
            let request = JsonRpcRequest(parse: json)
            expect(request?.id.number) == 42
        }

        it("parses a string id") {
            let json = "{" +
                "\"jsonrpc\":\"2.0\"," +
                "\"id\":\"test id\"," +
                "\"method\":\"test\"" +
            "}"
            let request = JsonRpcRequest(parse: json)
            expect(request?.id.string) == "test id"
        }
    }
}

//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import SwiftyJSON

class JsonRpcIdSpec: QuickSpec {
    override func spec() {
        it("can be instantiated without a value") {
            expect(JsonRpcId().json) == JSON()
        }

        it("can be instantiated with a number") {
            expect(JsonRpcId(42).json) == JSON(42)
        }

        it("can be instantiated with a string") {
            expect(JsonRpcId("some id").json) == JSON("some id")
        }

        it("can be instantiated with a JSON value") {
            expect(JsonRpcId(json: JSON("a json id")).json) == JSON("a json id")
        }

        it("can be compared with another JSON RCP id") {
            expect(JsonRpcId(42)) == JsonRpcId(42)
        }

        it("can be converted to an integer") {
            expect(JsonRpcId(42).int) == 42
            expect(JsonRpcId("not a number").int).to(beNil())
        }

        it("can be converted to a string") {
            expect(JsonRpcId("a string").string) == "a string"
            expect(JsonRpcId(42).string).to(beNil())
        }

        it("can be converted to an object") {
            expect(JsonRpcId(42).object as? Int) == 42
            expect(JsonRpcId("a string").object as? String) == "a string"
        }

        it("is encodable as an integer") {
            let encoder = JSONEncoder()
            let json = try! encoder.encode([JsonRpcId(42)])
            expect(try! JSON(data: json)) == JSON([42])
        }

        it("is encodable as a string") {
            let encoder = JSONEncoder()
            let json = try! encoder.encode([JsonRpcId("a string")])
            expect(try! JSON(data: json)) == JSON(["a string"])
        }

        it("is encodable as a null value") {
            let encoder = JSONEncoder()
            let json = try! encoder.encode([JsonRpcId()])
            expect(try! JSON(data: json)) == JSON([nil])
        }
    }
}

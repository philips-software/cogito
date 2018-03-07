//Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
@testable import Telepath

class Base64urlSpec: QuickSpec {
    override func spec() {
        describe("encoding") {
            it("encodes") {
                expect(Data(bytes: [0, 1, 2]).base64urlEncodedString()) == "AAEC"
            }

            it("uses - instead of base64 +") {
                expect(Data(bytes: [250, 1, 2]).base64urlEncodedString()) == "-gEC"
            }

            it("uses _ instead of base64 /") {
                expect(Data(bytes: [255, 1, 2]).base64urlEncodedString()) == "_wEC"
            }

            it("does not output base64 padding") {
                expect(Data(bytes: [0, 1, 2, 3]).base64urlEncodedString()) == "AAECAw"
            }
        }

        describe("decoding") {
            it("decodes") {
                expect(Data(base64urlEncoded: "AAEC")) == Data(bytes: [0, 1, 2])
            }

            it("parses - as base64 +") {
                expect(Data(base64urlEncoded: "-gEC")) == Data(bytes: [250, 1, 2])
            }

            it("parses _ as base64 /") {
                expect(Data(base64urlEncoded: "_wEC")) == Data(bytes: [255, 1, 2])
            }

            it("infers padding") {
                expect(Data(base64urlEncoded: "AAECAw")) == Data(bytes: [0, 1, 2, 3])
            }

            it("does not accept invalid number of base64 characters") {
                expect(Data(base64urlEncoded: "AAECA")).to(beNil())
            }
        }
    }
}

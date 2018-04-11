//Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
@testable import Telepath

class UrlParameterParserSpec: QuickSpec {
    override func spec() {
        it("parses url parameters") {
            expect(parseUrlParameters("A=1&B=2")) == [ "A": "1", "B": "2"]
        }

        it("ignores empty parameters") {
            expect(parseUrlParameters("")) == [:]
            expect(parseUrlParameters("A=1&")) == [ "A": "1" ]
            expect(parseUrlParameters("&B=2")) == [ "B": "2" ]
        }

        it("ignores empty values") {
            expect(parseUrlParameters("A=&B=2")) == [ "B": "2" ]
        }

        it("ignores empty keys") {
            expect(parseUrlParameters("=")) == [:]
            expect(parseUrlParameters("=1&B=2")) == [ "B": "2" ]
        }

        it("handles parameter values containing '='") {
            expect(parseUrlParameters("A=1=1&B=2")) == [ "A": "1=1", "B": "2" ]
        }

        it("removes percent encoding") {
            expect(parseUrlParameters("A%20B=1%202")) == [ "A B": "1 2" ]
        }

        it("ignores incorrect percent encoding") {
            expect(parseUrlParameters("A=1&B=%2")) == [ "A": "1" ]
            expect(parseUrlParameters("A=1&B%=2")) == [ "A": "1" ]
        }
    }
}

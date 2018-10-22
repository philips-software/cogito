// Copyright (c) 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
@testable import Cogito

class AttestationSpec: QuickSpec {
    override func spec() {
        it("can initialize using type and value") {
            let attestation = Attestation(type: "email", value: "test@example.com")
            expect(attestation.type) == "email"
            expect(attestation.value) == "test@example.com"
        }

        it("can initialize from string") {
            let attestation = Attestation(string: "email:test@example.com")
            expect(attestation?.type) == "email"
            expect(attestation?.value) == "test@example.com"
        }

        it("cannot initialize from incorrectly formatted string") {
            expect(Attestation(string: "abc")).to(beNil())
        }

        it("can initialize from string with unknown type") {
            let attestation = Attestation(string: "a:b")
            expect(attestation?.type) == "a"
            expect(attestation?.value) == "b"
        }
    }
}

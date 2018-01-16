//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class TransactionSpec: QuickSpec {
    override func spec() {
        let validTransaction = ["from": Address.testAddress1.description,
                                "to": Address.testAddress2.description,
                                "data": "0xabcdef",
                                "gasPrice": "0x1", "gasLimit": "0x2",
                                "nonce": "0x3", "value": "0x4"]

        describe("missing fields") {
            func itCannotInitializeWhenMissing(field: String) {
                var transaction = validTransaction
                transaction.removeValue(forKey: field)
                expect(Transaction(from: transaction)).to(beNil())
            }

            it("cannot initialize when from is missing") { itCannotInitializeWhenMissing(field: "from") }
            it("cannot initialize when to is missing") { itCannotInitializeWhenMissing(field: "to") }
            it("cannot initialize when data is missing") { itCannotInitializeWhenMissing(field: "data") }
            it("cannot initialize when nonce is missing") { itCannotInitializeWhenMissing(field: "nonce") }
            it("cannot initialize when gasLimit is missing") { itCannotInitializeWhenMissing(field: "gasLimit") }
            it("cannot initialize when gasPrice is missing") { itCannotInitializeWhenMissing(field: "gasPrice") }
            it("cannot initialize when value is missing") { itCannotInitializeWhenMissing(field: "value") }
        }

        describe("invalid fields") {
            func itCannotInitializeWhen(field: String, is value: String) {
                var transaction = validTransaction
                transaction[field] = value
                expect(Transaction(from: transaction)).to(beNil())
            }

            it("dispatches invalid when from is invalid") { itCannotInitializeWhen(field: "from", is: "0x1") }
            it("dispatches invalid when to is invalid") { itCannotInitializeWhen(field: "to", is: "0x2") }
            it("dispatches invalid when data is invalid") { itCannotInitializeWhen(field: "data", is: "0x3") }
//            it("dispatches invalid when nonce is invalid") { itDispatchesInvalidWhen(field: "nonce", is: "0x") }
        }

        it("can initialize with valid data") {
            let tx = Transaction(from: validTransaction)
            expect(tx).toNot(beNil())
        }
    }
}

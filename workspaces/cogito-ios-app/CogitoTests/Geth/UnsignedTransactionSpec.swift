import Quick
import Nimble
@testable import Cogito

class UnsignedTransactionSpec: QuickSpec {
    override func spec() {
        let validTransaction: [String: Any] = [
            "from": Address.testAddress1.description,
            "to": Address.testAddress2.description,
            "data": "0xabcdef",
            "gasPrice": "0x1",
            "gasLimit": "0x2",
            "nonce": "0x30",
            "value": "0x4",
            "chainId": 55
        ]

        describe("missing fields") {
            func itCannotInitializeWhenMissing(field: String) {
                var transaction = validTransaction
                transaction.removeValue(forKey: field)
                expect(UnsignedTransaction(from: transaction)).to(beNil())
            }

            it("cannot initialize when from is missing") {
                itCannotInitializeWhenMissing(field: "from")
            }
            it("cannot initialize when to is missing") {
                itCannotInitializeWhenMissing(field: "to")
            }
            it("cannot initialize when data is missing") {
                itCannotInitializeWhenMissing(field: "data")
            }
            it("cannot initialize when nonce is missing") {
                itCannotInitializeWhenMissing(field: "nonce")
            }
            it("cannot initialize when gasLimit is missing") {
                itCannotInitializeWhenMissing(field: "gasLimit")
            }
            it("cannot initialize when gasPrice is missing") {
                itCannotInitializeWhenMissing(field: "gasPrice")
            }
            it("cannot initialize when value is missing") {
                itCannotInitializeWhenMissing(field: "value")
            }
            it("cannot initialize when chain id is missing") {
                itCannotInitializeWhenMissing(field: "chainId")
            }
        }

        describe("invalid fields") {
            func itCannotInitializeWhen(field: String, is value: String) {
                var transaction = validTransaction
                transaction[field] = value
                expect(UnsignedTransaction(from: transaction)).to(beNil())
            }

            it("dispatches invalid when from is invalid") { itCannotInitializeWhen(field: "from", is: "0x1") }
            it("dispatches invalid when to is invalid") { itCannotInitializeWhen(field: "to", is: "0x2") }
            it("dispatches invalid when data is invalid") { itCannotInitializeWhen(field: "data", is: "0x3") }
            it("dispatches invalid when nonce is invalid") { itCannotInitializeWhen(field: "nonce", is: "0x") }
        }

        it("can initialize with valid data") {
            let transaction = UnsignedTransaction(from: validTransaction)
            expect(transaction).toNot(beNil())
            expect(transaction?.from) == Address.testAddress1
            expect(transaction?.to) == Address.testAddress2
            expect(transaction?.data) == Data(fromHex: "0xabcdef")
            expect(transaction?.nonce.description) == "48"
            expect(transaction?.gasPrice.description) == "1"
            expect(transaction?.gasLimit.description) == "2"
            expect(transaction?.value.description) == "4"
        }

        it("accepts plain number for gasPrice") {
            var transaction = validTransaction
            transaction["gasPrice"] = 42
            let unsigned = UnsignedTransaction(from: transaction)
            expect(unsigned?.gasPrice.description) == "42"
        }
    }
}

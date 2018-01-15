//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class TransactionSignerSpec: QuickSpec {
    override func spec() {
        describe("missing fields") {
            let validTransaction = ["from": "0x123", "to": "0x456", "data": "0xabcdef",
                                    "gasPrice": "0x1", "gasLimit": "0x2",
                                    "nonce": "0x3", "value": "0x4"]

            func itDispatchesInvalidWhenMissing(field: String) {
                var transaction = validTransaction
                transaction.removeValue(forKey: field)

                let store = RecordingStore()
                let builder = TransactionSignerBuilder(transaction: transaction,
                                                       dispatch: store.dispatch,
                                                       getState: { return nil })
                let signer = builder.build()
                expect(signer).to(beAKindOf(TransactionSignerInvalid.self))
                signer.execute()
                let lastAction = store.actions.last as? TelepathActions.SendPending
                expect(lastAction?.message).to(contain("missing or invalid field(s) in transaction data"))
            }

            it("dispatches invalid when from is missing") { itDispatchesInvalidWhenMissing(field: "from") }
            it("dispatches invalid when to is missing") { itDispatchesInvalidWhenMissing(field: "to") }
            it("dispatches invalid when data is missing") { itDispatchesInvalidWhenMissing(field: "data") }
            it("dispatches invalid when nonce is missing") { itDispatchesInvalidWhenMissing(field: "nonce") }
            it("dispatches invalid when gasLimit is missing") { itDispatchesInvalidWhenMissing(field: "gasLimit") }
            it("dispatches invalid when gasPrice is missing") { itDispatchesInvalidWhenMissing(field: "gasPrice") }
            it("dispatches invalid when value is missing") { itDispatchesInvalidWhenMissing(field: "value") }
            it("dispatches valid otherwise") {
                let store = RecordingStore()
                let builder = TransactionSignerBuilder(transaction: validTransaction,
                                                       dispatch: store.dispatch,
                                                       getState: { return nil })
                let signer = builder.build()
                expect(signer).to(beAKindOf(TransactionSignerValid.self))
            }
        }
    }
}

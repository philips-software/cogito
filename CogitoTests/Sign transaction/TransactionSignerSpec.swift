//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class TransactionSignerSpec: QuickSpec {
    override func spec() {
        let validTransaction = ["from": Address.testAddress1.description,
                                "to": Address.testAddress2.description,
                                "data": "0xabcdef",
                                "gasPrice": "0x1", "gasLimit": "0x2",
                                "nonce": "0x3", "value": "0x4"]
        var store: RecordingStore!

        beforeEach {
            store = RecordingStore()
        }

        it("dispatches invalid when transaction data is incomplete") {
            var transaction = validTransaction
            transaction.removeValue(forKey: "from")

            let builder = TransactionSignerBuilder(transaction: transaction,
                                                   dispatch: store.dispatch,
                                                   getState: { return nil },
                                                   responseId: JsonRpcId(0))
            let signer = builder.build()
            expect(signer).to(beAKindOf(TransactionSignerInvalid.self))
            signer.execute()
            let lastAction = store.actions.last as? TelepathActions.SendPending
            expect(lastAction?.message).to(contain("missing or invalid field(s) in transaction data"))
        }

        it("dispatches invalid when transaction data is invalid") {
            var transaction = validTransaction
            transaction["from"] = "foo"

            let builder = TransactionSignerBuilder(transaction: transaction,
                                                   dispatch: store.dispatch,
                                                   getState: { return nil },
                                                   responseId: JsonRpcId(0))
            let signer = builder.build()
            expect(signer).to(beAKindOf(TransactionSignerInvalid.self))
            signer.execute()
            let lastAction = store.actions.last as? TelepathActions.SendPending
            expect(lastAction?.message).to(contain("missing or invalid field(s) in transaction data"))
        }

        it("builds valid signer when transaction data is valid") {
            let builder = TransactionSignerBuilder(transaction: validTransaction,
                                                   dispatch: store.dispatch,
                                                   getState: { return nil },
                                                   responseId: JsonRpcId(0))
            let signer = builder.build()
            expect(signer).to(beAKindOf(TransactionSignerValid.self))
        }
    }
}

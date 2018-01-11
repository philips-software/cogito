//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class TransactionSignerSpec: QuickSpec {
    override func spec() {
        it("dispatches invalid when from is missing") {
            let store = RecordingStore()
            let builder = TransactionSignerBuilder(transaction: [:],
                                                   dispatch: store.dispatch,
                                                   getState: { return nil })
            let signer = builder.build()
            expect(signer).to(beAKindOf(TransactionSignerInvalid.self))
            signer.execute()
            let lastAction = store.actions.last as? TelepathActions.SendPending
            expect(lastAction?.message).to(contain("'from'"))
        }
    }
}

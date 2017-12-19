//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwiftThunk

class TransactionSigningServiceSpec: QuickSpec {
    override func spec() {
        let signRequest = "{\"method\":\"signTransaction\",\"params\":{}}"

        var service: TransactionSigningService!
        var store: StoreSpy!

        beforeEach {
            store = StoreSpy()
            service = TransactionSigningService(store: store)
        }

        context("when a sign requests comes in") {
            beforeEach {
                service.newState(state: [signRequest])
            }

            it("dispatches the SignTransaction action") {
                expect(store.actions.last as? ThunkAction<AppState>).toNot(beNil())
            }
        }
    }
}

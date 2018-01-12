//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwiftThunk
import SwiftyJSON

class TransactionSigningServiceSpec: QuickSpec {
    override func spec() {
        let signRequest = JsonRpcRequest(
            id: JSON(),
            method: "sign",
            params: JSON()
        )

        var service: TransactionSigningService!
        var store: StoreSpy!

        beforeEach {
            store = StoreSpy()
            service = TransactionSigningService(store: store)
        }

        context("when a sign requests comes in") {
            beforeEach {
                service.onRequest(signRequest)
            }

            it("dispatches the SignTransaction action") {
                expect(store.actions.last as? ThunkAction<AppState>).toNot(beNil())
            }
        }
    }
}

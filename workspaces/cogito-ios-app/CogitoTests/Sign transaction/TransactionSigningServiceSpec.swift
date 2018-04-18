//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwiftThunk

class TransactionSigningServiceSpec: QuickSpec {
    override func spec() {
        let signRequest = JsonRpcRequest(method: "sign", params: JsonRpcParams(parseJSON: "[{}]"))

        var service: TransactionSigningService!
        var store: StoreSpy!

        beforeEach {
            store = StoreSpy()
            service = TransactionSigningService(store: store)
        }

        context("when a sign requests comes in") {
            beforeEach {
                service.onRequest(signRequest, on: TelepathChannel.example)
            }

            it("dispatches the SignTransaction action") {
                expect(store.actions.last as? ThunkAction<AppState>).toNot(beNil())
            }
        }

        context("when a different request comes in") {
            beforeEach {
                let request = JsonRpcRequest(method: "other")
                service.onRequest(request, on: TelepathChannel.example)
            }

            it("is ignored") {
                expect(store.actions.last as? ThunkAction<AppState>).to(beNil())
            }
        }
    }
}

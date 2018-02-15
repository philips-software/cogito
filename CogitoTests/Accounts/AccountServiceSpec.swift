//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwiftThunk

class AccountServiceSpec: QuickSpec {
    override func spec() {
        let accountRequest = JsonRpcRequest(
            id: JsonRpcId(1),
            method: "accounts",
            params: JsonRpcParams()
        )

        var service: AccountService!
        var store: StoreSpy!

        beforeEach {
            store = StoreSpy()
            service = AccountService(store: store)
        }

        describe("when an account request comes in") {
            beforeEach {
                service.onRequest(accountRequest)
            }

            it("dispatches the GetAccounts action") {
                expect(store.actions.last as? ThunkAction<AppState>).toNot(beNil())
            }
        }

        describe("when a different request comes in") {
            beforeEach {
                let request = JsonRpcRequest(
                    id: JsonRpcId(),
                    method: "other",
                    params: JsonRpcParams()
                )
                service.onRequest(request)
            }

            it("is ignored") {
                expect(store.actions.last as? ThunkAction<AppState>).to(beNil())
            }
        }
    }
}

//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwiftThunk
@testable import Cogito

class AccountServiceSpec: QuickSpec {
    override func spec() {
        let accountRequest = JsonRpcRequest(method: "accounts")

        var service: AccountService!
        var store: StoreSpy!

        beforeEach {
            store = StoreSpy()
            service = AccountService(store: store)
        }

        describe("when an account request comes in") {
            beforeEach {
                service.onRequest(accountRequest, on: TelepathChannel.example)
            }

            it("dispatches the GetAccounts action") {
                expect(store.actions.last as? ThunkAction<AppState>).toNot(beNil())
            }
        }

        describe("when a different request comes in") {
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

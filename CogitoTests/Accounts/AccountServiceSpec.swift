//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwiftThunk

class AccountServiceSpec: QuickSpec {
    override func spec() {
        let accountRequest = "{\"method\":\"accounts\"}"

        var service: AccountService!
        var store: StoreSpy!

        beforeEach {
            store = StoreSpy()
            service = AccountService(store: store)
        }

        describe("when an account request comes in") {
            beforeEach {
                service.newState(state: [accountRequest])
            }

            it("dispatches the GetAccounts action") {
                expect(store.actions.last as? ThunkAction<AppState>).toNot(beNil())
            }
        }
    }
}

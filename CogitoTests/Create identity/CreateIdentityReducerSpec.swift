//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import Geth

class CreateIdentityReducerSpec: QuickSpec {
    override func spec() {
        it("handles SetDescription") {
            let action = CreateIdentityActions.SetDescription(description: "me")
            let state = createIdentityReducer(action: action, state: nil)
            expect(state.description) == "me"
        }

        it("handles Reset") {
            let state = CreateIdentityState(description: "me",
                                            pending: true,
                                            newAccount: GethAccount(),
                                            error: "some error")
            let action = CreateIdentityActions.Reset()
            let nextState = createIdentityReducer(action: action, state: state)
            expect(nextState.description) == ""
            expect(nextState.pending).to(beFalse())
            expect(nextState.newAccount).to(beNil())
            expect(nextState.error).to(beNil())
        }

        it("handles Pending") {
            let state = CreateIdentityState(description: "me",
                                            pending: false,
                                            newAccount: GethAccount(),
                                            error: "some error")
            let action = CreateIdentityActions.Pending()
            let nextState = createIdentityReducer(action: action, state: state)
            expect(nextState.pending).to(beTrue())
            expect(nextState.newAccount).to(beNil())
            expect(nextState.error).to(beNil())
        }

        it("handles Fulfilled") {
            let state = CreateIdentityState(description: "me",
                                            pending: true,
                                            newAccount: nil,
                                            error: nil)
            let account = GethAccount()!
            let action = CreateIdentityActions.Fulfilled(account: account)
            let nextState = createIdentityReducer(action: action, state: state)
            expect(nextState.pending).to(beFalse())
            expect(nextState.newAccount) === account
        }

        it("handles Rejected") {
            let state = CreateIdentityState(description: "me",
                                            pending: true,
                                            newAccount: nil,
                                            error: nil)
            let error = "some error"
            let action = CreateIdentityActions.Rejected(message: error)
            let nextState = createIdentityReducer(action: action, state: state)
            expect(nextState.pending).to(beFalse())
            expect(nextState.error) == error
        }
    }
}

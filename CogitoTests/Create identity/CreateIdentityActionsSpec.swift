//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwift
import ReSwiftThunk

class CreateIdentityActionsSpec: QuickSpec {
    override func spec() {
        var testState: AppState!
        let getState: () -> AppState? = { return testState }
        var createAction: ThunkAction<AppState>!

        beforeEach {
            createAction = CreateIdentityActions.CreateIdentity()
        }

        it("dispatches pending") {
            let dispatchChecker = DispatchChecker<CreateIdentityActions.Pending>()
            createAction.action(dispatchChecker.dispatch, getState)
            expect(dispatchChecker.count) == 1
        }

        it("dispatches rejected when state doesn't have key store") {
            let dispatchChecker = DispatchChecker<CreateIdentityActions.Rejected>()
            createAction.action(dispatchChecker.dispatch, getState)
            expect(dispatchChecker.count) == 1
        }

        context("given proper state") {
            var keyStore: KeyStoreMock!

            beforeEach {
                keyStore = KeyStoreMock(path: "", scryptN: 0, scryptP: 0)
                testState = appState(keyStore: KeyStoreState(keyStore: keyStore))
            }

            it("calls newAccount on keystore from state") {
                createAction.action({ _ in }, getState)
                expect(keyStore.newAccountCallCount).toEventually(equal(1))
            }

            it("dispatches fulfilled with new account address") {
                let dispatchChecker = DispatchChecker<CreateIdentityActions.Fulfilled>()
                let account = Account()
                keyStore.newAccountReturn = account
                createAction.action(dispatchChecker.dispatch, getState)
                expect(dispatchChecker.count).toEventually(equal(1))
                expect(dispatchChecker.actions[0].account).toEventually(beIdenticalTo(account))
            }

            it("dispatches rejected when new account fails") {
                let dispatchChecker = DispatchChecker<CreateIdentityActions.Rejected>()
                createAction.action(dispatchChecker.dispatch, getState)
                expect(dispatchChecker.count).toEventually(equal(1))
            }
        }
    }
}

private class KeyStoreMock: KeyStore {
    var newAccountCallCount = 0
    var newAccountReturn: Account?
    var newAccountError: String?

    override func newAccount(onComplete: @escaping (_ account: Account?, _ error: String?) -> Void) {
        newAccountCallCount += 1
        DispatchQueue.global().async { [unowned self] in
            onComplete(self.newAccountReturn, self.newAccountError)
        }
    }
}

class DispatchChecker<ActionType> {
    var actions = [ActionType]()
    var count: Int { return actions.count }
    var dispatch: DispatchFunction!

    init() {
        dispatch = { action in
            if let action = action as? ActionType {
                self.actions.append(action)
            }
        }
    }
}

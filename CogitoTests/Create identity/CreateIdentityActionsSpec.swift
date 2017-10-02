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

        it("calls newAccount on keystore from state") {
            let keyStore = KeyStoreMock(path: "", scryptN: 0, scryptP: 0)
            testState = appState(keyStore: KeyStoreState(keyStore: keyStore))
            createAction.action({ _ in }, getState)
            expect(keyStore.newAccountCallCount) == 1
        }
    }
}

private class KeyStoreMock: KeyStore {
    var newAccountCallCount = 0
    override func newAccount() {
        newAccountCallCount += 1
    }
}

class DispatchChecker<ActionType> {
    var count = 0
    var dispatch: DispatchFunction!

    init() {
        dispatch = { action in
            if action is ActionType {
                self.count += 1
            }
        }
    }
}

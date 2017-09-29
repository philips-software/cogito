//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class CreateIdentityReducerSpec: QuickSpec {
    override func spec() {
        it("handles SetDescription") {
            let action = CreateIdentityActions.SetDescription(description: "me")
            let state = createIdentityReducer(action: action, state: nil)
            expect(state.description) == "me"
        }

        it("handles Reset") {
            let state = CreateIdentityState(description: "me")
            let action = CreateIdentityActions.Reset()
            let nextState = createIdentityReducer(action: action, state: state)
            expect(nextState.description) == ""
        }
    }
}

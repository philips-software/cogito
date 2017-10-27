//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class AttestationsReducerSpec: QuickSpec {
    override func spec() {
        it("handles pending") {
            let initialState = AttestationsState(pending: ["already pending": "whatever"])
            let action = AttestationActions.Pending(nonce: "test nonce", subject: "test subject")
            let nextState = attestationsReducer(action: action, state: initialState)
            expect(nextState.pending) == [
                "already pending": "whatever",
                "test nonce": "test subject"
            ]
        }
    }
}

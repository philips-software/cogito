//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
@testable import Cogito

class DialogPresenterReducerSpec: QuickSpec {
    override func spec() {
        it("handles DidDismissAlert") {
            let alert1 = RequestedAlert(title: "1", message: "1", actions: [])
            let alert2 = RequestedAlert(title: "2", message: "2", actions: [])
            let state = DialogPresenterState(requestedAlerts: [alert1, alert2])
            let action = DialogPresenterActions.DidDismissAlert()
            let newState = dialogPresenterReducer(action: action, state: state)
            expect(newState.requestedAlerts) == [alert2]
        }

        it("handles RequestAlert") {
            let alert1 = RequestedAlert(title: "1", message: "1", actions: [])
            let alert2 = RequestedAlert(title: "2", message: "2", actions: [])
            let state = DialogPresenterState(requestedAlerts: [alert1])
            let action = DialogPresenterActions.RequestAlert(requestedAlert: alert2)
            let newState = dialogPresenterReducer(action: action, state: state)
            expect(newState.requestedAlerts) == [alert1, alert2]
        }
    }
}

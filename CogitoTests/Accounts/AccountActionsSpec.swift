//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwiftThunk

class AccountActionsSpec: QuickSpec {
    override func spec() {
        context("given that a facet was selected") {
            let address = Address.testAddress
            var state: AppState!

            beforeEach {
                let identity = Identity(description: "me", address: address)
                state = appState(diamond: DiamondState(facets: [identity]))
            }

            it("sends out its Ethereum address via Telepath") {
                let thunkRecorder = DispatchRecorder<ThunkAction<AppState>>()
                let sendRecorder = DispatchRecorder<TelepathActions.SendPending>()
                let action = AccountActions.GetAccounts()
                action.action(thunkRecorder.dispatch, { return state })
                thunkRecorder.actions[0].action(sendRecorder.dispatch, { return state })
                let send = sendRecorder.actions.last
                expect(send?.message) == "{\"result\":[\"\(address)\"]}"
            }
        }

        context("when no facet was selected") {
            var state: AppState!

            beforeEach {
                state = appState(diamond: DiamondState(facets: []))
            }

            it("returns an empty list") {
                let thunkRecorder = DispatchRecorder<ThunkAction<AppState>>()
                let sendRecorder = DispatchRecorder<TelepathActions.SendPending>()
                let action = AccountActions.GetAccounts()
                action.action(thunkRecorder.dispatch, { return state })
                thunkRecorder.actions[0].action(sendRecorder.dispatch, { return state })
                let send = sendRecorder.actions.last
                expect(send?.message) == "{\"result\":[]}"
            }
        }
    }
}

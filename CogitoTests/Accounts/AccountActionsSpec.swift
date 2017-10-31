//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

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
                let recorder = DispatchRecorder<TelepathActions.Send>()
                let action = AccountActions.GetAccounts()
                action.action(recorder.dispatch, { return state })
                let send = recorder.actions.last
                expect(send?.message) == "{\"result\":[\"\(address)\"]}"
            }
        }

        context("when no facet was selected") {
            var state: AppState!

            beforeEach {
                state = appState(diamond: DiamondState(facets: []))
            }

            it("returns an empty list") {
                let recorder = DispatchRecorder<TelepathActions.Send>()
                let action = AccountActions.GetAccounts()
                action.action(recorder.dispatch, { return state })
                let send = recorder.actions.last
                expect(send?.message) == "{\"result\":[]}"
            }
        }
    }
}

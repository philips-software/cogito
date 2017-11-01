//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class AccountActionsSpec: QuickSpec {
    override func spec() {
        var store: RecordingStore!

        beforeEach {
            store = RecordingStore()
        }

        context("given that a facet was selected") {
            let address = Address.testAddress

            beforeEach {
                let identity = Identity(description: "me", address: address)
                store.state = appState(diamond: DiamondState(facets: [identity]))
            }

            it("sends out its Ethereum address via Telepath") {
                store.dispatch(AccountActions.GetAccounts())
                let send = store.actions.last as? TelepathActions.SendPending
                expect(send?.message) == "{\"result\":[\"\(address)\"]}"
            }
        }

        context("when no facet was selected") {
            beforeEach {
                store.state = appState(diamond: DiamondState(facets: []))
            }

            it("returns an empty list") {
                store.dispatch(AccountActions.GetAccounts())
                let send = store.actions.last as? TelepathActions.SendPending
                expect(send?.message) == "{\"result\":[]}"
            }
        }
    }
}

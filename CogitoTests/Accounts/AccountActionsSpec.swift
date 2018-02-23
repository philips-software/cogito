//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import SwiftyJSON

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
                store.dispatch(AccountActions.GetAccounts(requestId: JsonRpcId(1),
                                                          channel: TelepathChannel.example))
                let send = store.actions.last as? TelepathActions.SendPending
                let response = JSON(parseJSON: send!.message)
                expect(response["result"]) == JSON(["\(address)"])
            }
        }

        context("when no facet was selected") {
            beforeEach {
                store.state = appState(diamond: DiamondState(facets: []))
            }

            it("returns an empty list") {
                store.dispatch(AccountActions.GetAccounts(requestId: JsonRpcId(1),
                                                          channel: TelepathChannel.example))
                let send = store.actions.last as? TelepathActions.SendPending
                let response = JSON(parseJSON: send!.message)
                expect(response["result"]) == JSON([])
            }
        }
    }
}

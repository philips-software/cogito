//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import SwiftyJSON
@testable import Cogito

class AccountActionsSpec: QuickSpec {
    override func spec() {
        var store: RecordingStore!

        beforeEach {
            store = RecordingStore()
        }

        context("given that a facet was selected") {
            let address = Address.testAddress
            var channel: TelepathChannel!

            beforeEach {
                channel = TelepathChannelSpy()
                let identity = Identity(description: "me", address: address)
                store.state = appState(
                    diamond: DiamondState(facets: [identity]),
                    telepath: TelepathState(channels: [channel: identity.identifier],
                                            connectionError: nil, receivedMessages: [], receiveError: nil)
                )
            }

            it("sends out its Ethereum address via Telepath") {
                store.dispatch(AccountActions.GetAccounts(requestId: JsonRpcId(1),
                                                          channel: channel))
                let send = store.firstAction(ofType: TelepathActions.SendPending.self)
                let response = JSON(parseJSON: send!.message)
                expect(response["result"]) == JSON(["\(address)"])
            }
        }

        context("given multiple accounts") {
            let address1 = Address.testAddress1
            let address2 = Address.testAddress2
            var channel1: TelepathChannel!
            var channel2: TelepathChannel!

            beforeEach {
                let identity1 = Identity(description: "1", address: address1)
                let identity2 = Identity(description: "2", address: address2)
                channel1 = TelepathChannelSpy(id: "1")
                channel2 = TelepathChannelSpy(id: "2")
                store.state = appState(
                    diamond: DiamondState(facets: [identity1, identity2]),
                    telepath: TelepathState(channels: [channel1: identity1.identifier, channel2: identity2.identifier],
                                            connectionError: nil, receivedMessages: [], receiveError: nil)
                )
            }

            it("returns the account matching the Telepath channel") {
                store.dispatch(AccountActions.GetAccounts(requestId: JsonRpcId(1),
                                                          channel: channel2))
                let send = store.firstAction(ofType: TelepathActions.SendPending.self)
                let response = JSON(parseJSON: send!.message)
                expect(response["result"]) == JSON(["\(address2)"])
            }
        }
    }
}

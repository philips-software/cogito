//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import Geth

class AppReducerSpec: QuickSpec {
    override func spec() {
        it("returns initial state when reset") {
            let state = appState(
                keyStore: KeyStoreState(keyStore: KeyStore(name: "test", scryptN: 0, scryptP: 0)),
                geth: GethState(peersCount: 1, syncProgress: nil),
                createIdentity: CreateIdentityState(description: "test", pending: true, newAccount: nil, error: "test"),
                diamond: DiamondState(facets: [Identity(description: "test", gethAddress: GethAddress())]),
                telepath: TelepathState(channel: TelepathChannel.example)
            )
            let action = ResetAppState()
            let nextState = appReducer(action: action, state: state)
            expect(nextState) == initialAppState
        }
    }
}

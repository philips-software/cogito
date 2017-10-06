//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import Geth

class DiamondReducerSpec: QuickSpec {
    override func spec() {
        var keyStoreDir: String!
        var keyStore: GethKeyStore!
        var account0: GethAccount!

        beforeEach {
            keyStoreDir = NSSearchPathForDirectoriesInDomains(.cachesDirectory,
                                                              .userDomainMask,
                                                              true)[0] + "/test.keystore"
            keyStore = GethKeyStore(keyStoreDir,
                                    scryptN: GethLightScryptN,
                                    scryptP: GethLightScryptP)
            expect {
                account0 = try keyStore.newAccount("some pass")
            }.toNot(throwError())
        }

        afterEach {
            do {
                try FileManager.default.removeItem(atPath: keyStoreDir)
            } catch let e {
                print(e)
                abort()
            }
        }

        it("handles CreateFacet") {
            let action = DiamondActions.CreateFacet(description: "my id", account: account0)
            let newState = diamondReducer(action: action, state: nil)
            expect(newState.facets.count) == 1
            expect(newState.facets[0]) == Identity(description: "my id",
                                                   gethAddress: account0.getAddress()!)
            expect(newState.selectedFacet) == 0
        }

        it("doesn't change selectedFacet when one was already selected") {
            var state = DiamondState(facets: [])
            state.selectedFacet = 1
            let action = DiamondActions.CreateFacet(description: "my id", account: account0)
            let newState = diamondReducer(action: action, state: state)
            expect(newState.selectedFacet) == 1
        }
    }
}

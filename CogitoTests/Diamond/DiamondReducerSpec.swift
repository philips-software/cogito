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

        context("when a new identity is created") {
            it("adds the correspoding facet to the diamond") {
                let action = CreateIdentityActions.Fulfilled(account: account0)
                let state = diamondReducer(action: action, state: nil)
                expect(state.facets.count) == 1
                expect(state.facets[0]) == Identity(description: "my id",
                                                    gethAddress: account0.getAddress()!)
            }
        }
    }
}

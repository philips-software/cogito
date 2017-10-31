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
            let firstFacet = newState.facets.values.first!
            expect(firstFacet.description) == "my id"
            expect(firstFacet.gethAddress.getHex()!) == account0.getAddress()!.getHex()!
            expect(newState.selectedFacet) == firstFacet.identifier
        }

        it("doesn't change selectedFacet when one was already selected") {
            var state = DiamondState(facets: [])
            let someIdentifier = UUID()
            state.selectedFacet = someIdentifier
            let action = DiamondActions.CreateFacet(description: "my id", account: account0)
            let newState = diamondReducer(action: action, state: state)
            expect(newState.selectedFacet) == someIdentifier
        }

        it("handles AddJWTAttestation") {
            let identity = Identity(description: "test identity", address: Address.testAddress1)
            let idToken = "some token"
            let initialState = DiamondState(facets: [identity])
            let action = DiamondActions.AddJWTAttestation(identity: identity, idToken: idToken)
            let nextState = diamondReducer(action: action, state: initialState)
            expect(nextState.facets[identity.identifier]!.idTokens).to(contain(idToken))
        }
    }
}

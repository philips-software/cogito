//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import Geth
@testable import Cogito

class DiamondStateSpec: QuickSpec {
    override func spec() {
        var keyStoreDir: String!
        var keyStore: GethKeyStore!
        var account0: GethAccount!
        var identity0: Identity!

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
            let address = Address(from: account0.getAddress()!)
            identity0 = Identity(description: "first identity", address: address)
        }

        afterEach {
            do {
                try FileManager.default.removeItem(atPath: keyStoreDir)
            } catch let error {
                print(error)
                abort()
            }
        }

        it("can be encoded and decoded") {
            let state = DiamondState(facets: [identity0])
            let encoder = JSONEncoder()
            var encodedData: Data!
            expect {
                encodedData = try encoder.encode(state)
            }.toNot(throwError())

            let decoder = JSONDecoder()
            var decodedState: DiamondState?
            expect {
                decodedState = try decoder.decode(DiamondState.self, from: encodedData)
            }.toNot(throwError())
            expect(decodedState) == state
        }

        it("can find an identity by address") {
            let state = DiamondState(facets: [identity0])
            expect(state.findIdentity(address: identity0.address)) == identity0
        }

        it("cannot find a non-existing identity") {
            let state = DiamondState(facets: [])
            expect(state.findIdentity(address: identity0.address)).to(beNil())
        }
    }
}

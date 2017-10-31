//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import Geth

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
            } catch let e {
                print(e)
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
            let encoded = String(data: encodedData, encoding: .utf8)
            let address = account0.getAddress()!.getHex()!
            expect(encoded) == "{\"selectedFacet\":\"\(identity0.identifier)\"," +
                               "\"facets\":[\"\(identity0.identifier)\",{" +
                               "\"description\":\"first identity\"," +
                               "\"address\":{\"value\":\"\(address)\"}," +
                               "\"identifier\":\"\(identity0.identifier)\"}" +
                               "]}"

            let decoder = JSONDecoder()
            var decodedState: DiamondState!
            expect {
                decodedState = try decoder.decode(DiamondState.self, from: encodedData)
            }.toNot(throwError())
            expect(decodedState) == state
        }
    }
}

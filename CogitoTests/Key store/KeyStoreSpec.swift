//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class KeyStoreSpec: QuickSpec {
    override func spec() {
        it("can be encoded and decoded") {
            let keyStore = KeyStore(path: "some path", scryptN: 1, scryptP: 2)
            let encoder = JSONEncoder()
            var data: Data!
            expect {
                data = try encoder.encode(keyStore)
            }.toNot(throwError())
            let encoded = String(data: data, encoding: .utf8)
            expect(encoded) == "{\"path\":\"some path\",\"scryptN\":1,\"scryptP\":2}"

            let decoder = JSONDecoder()
            var decodedKeyStore: KeyStore!
            expect {
                decodedKeyStore = try decoder.decode(KeyStore.self, from: data)
            }.toNot(throwError())
            expect(decodedKeyStore) == keyStore
        }
    }
}

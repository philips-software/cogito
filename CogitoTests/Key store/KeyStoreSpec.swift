//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class KeyStoreSpec: QuickSpec {
    override func spec() {
        it("can be encoded and decoded") {
            let keyStore = KeyStore(name: "some name", scryptN: 1, scryptP: 2)
            let encoder = JSONEncoder()
            var data: Data!
            expect {
                data = try encoder.encode(keyStore)
            }.toNot(throwError())
            let encoded = String(data: data, encoding: .utf8)
            expect(encoded) == "{\"name\":\"some name\",\"scryptN\":1,\"scryptP\":2}"

            let decoder = JSONDecoder()
            var decodedKeyStore: KeyStore!
            expect {
                decodedKeyStore = try decoder.decode(KeyStore.self, from: data)
            }.toNot(throwError())
            expect(decodedKeyStore) == keyStore
        }

        it("can be reset") {
            let keyStore = KeyStore(name: "some name", scryptN: 1, scryptP: 2)
            expect {
                try FileManager.default.createDirectory(at: keyStore.storeUrl,
                                                        withIntermediateDirectories: false,
                                                        attributes: [:])
            }.toNot(throwError())
            expect(FileManager.default.fileExists(atPath: keyStore.storeUrl.path)).to(beTrue())
            expect { try keyStore.reset() }.toNot(throwError())
            expect(FileManager.default.fileExists(atPath: keyStore.storeUrl.path)).to(beFalse())
        }
    }
}

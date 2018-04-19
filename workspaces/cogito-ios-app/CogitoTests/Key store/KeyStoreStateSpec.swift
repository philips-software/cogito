//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
@testable import Cogito

class KeyStoreStateSpec: QuickSpec {
    override func spec() {
        it("can be coded") {
            let keyStore = KeyStore(name: "some name", scryptN: 42, scryptP: 24)
            let state = KeyStoreState(keyStore: keyStore)
            let encoder = JSONEncoder()
            var encodedData: Data? = nil
            expect {
                encodedData = try encoder.encode(state)
            }.toNot(throwError())
            expect { () -> Void in
                let decoder = JSONDecoder()
                let decodedState = try decoder.decode(KeyStoreState.self, from: encodedData!)
                expect(decodedState.keyStore?.name) == "some name"
                expect(decodedState.keyStore?.scryptN) == 42
                expect(decodedState.keyStore?.scryptP) == 24
            }.toNot(throwError())
        }
    }
}

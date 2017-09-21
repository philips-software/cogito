//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
@testable import Cogito

class KeyStoreStateSpec: QuickSpec {
    override func spec() {
        it("can be coded") {
            let keyStore = KeyStore(path: "some path", scryptN: 42, scryptP: 24)
            let state = KeyStoreState(keyStore: keyStore)
            let encoder = JSONEncoder()
            var encodedData: Data? = nil
            expect { () -> Void in
                encodedData = try encoder.encode(state)
                print("\(String(data: encodedData!, encoding: .utf8)!)")
            }.toNot(throwError())
            guard let encoded = encodedData else {
                fail("encodedData is nil")
                return
            }
            expect { () -> Void in
                let decoder = JSONDecoder()
                let decodedState = try decoder.decode(KeyStoreState.self, from: encoded)
                expect(decodedState.keyStore?.path) == "some path"
                expect(decodedState.keyStore?.scryptN) == 42
                expect(decodedState.keyStore?.scryptP) == 24
            }.toNot(throwError())
        }
    }
}

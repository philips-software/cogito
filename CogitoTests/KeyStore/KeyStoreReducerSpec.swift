//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
@testable import Cogito

class KeyStoreReducerSpec: QuickSpec {
    override func spec() {
        it("handles create key store fulfilled") {
            let keyStore = KeyStore(path: "", scryptN: 0, scryptP: 0)
            let action = KeyStoreActions.Fulfilled(keyStore: keyStore)
            let nextState = keyStoreReducer(action: action, state: nil)
            expect(nextState.keyStore) === keyStore
        }
    }
}

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class KeyStoreReducerSpec: QuickSpec {
    override func spec() {
        it("handles create key store fulfilled") {
            let keyStore = KeyStore(name: "", scryptN: 0, scryptP: 0)
            let action = KeyStoreActions.Fulfilled(keyStore: keyStore)
            let nextState = keyStoreReducer(action: action, state: nil)
            expect(nextState.keyStore) === keyStore
        }
    }
}

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

struct KeyStoreState: Codable {
    var keyStore: KeyStore?
}

extension KeyStoreState: Equatable {
    static func == (lhs: KeyStoreState, rhs: KeyStoreState) -> Bool {
        return lhs.keyStore == rhs.keyStore
    }
}

let initialKeyStoreState = KeyStoreState(keyStore: nil)

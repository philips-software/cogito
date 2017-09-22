//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

struct KeyStoreState: Codable {
    var keyStore: KeyStore?
}

let initialKeyStoreState = KeyStoreState(keyStore: nil)

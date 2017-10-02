//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

struct KeyStoreState: Codable {
    var keyStore: KeyStore?
}

let initialKeyStoreState = KeyStoreState(keyStore: nil)

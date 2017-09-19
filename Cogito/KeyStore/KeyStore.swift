//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Geth

protocol KeyStore {
    static func create(path: String, scryptN: Int, scryptP: Int) -> KeyStore
}

extension GethKeyStore: KeyStore {
    static func create(path: String, scryptN: Int, scryptP: Int) -> KeyStore {
        return GethKeyStore(path, scryptN: scryptN, scryptP: scryptP)
    }
}

//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Geth

class KeyStore: Codable {
    let path: String
    let scryptN: Int
    let scryptP: Int

    required init(path: String, scryptN: Int, scryptP: Int) {
        self.path = path
        self.scryptN = scryptN
        self.scryptP = scryptP
    }
}

class GethKeyStoreWrapper: KeyStore {
    var wrapped: GethKeyStore!

    required init(path: String, scryptN: Int, scryptP: Int) {
        super.init(path: path, scryptN: scryptN, scryptP: scryptP)
        wrapped = GethKeyStore(path, scryptN: scryptN, scryptP: scryptP)
    }

    required init(from decoder: Decoder) throws {
        try super.init(from: decoder)
        wrapped = GethKeyStore(path, scryptN: scryptN, scryptP: scryptP)
    }
}

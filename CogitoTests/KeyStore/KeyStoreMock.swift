//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

@testable import Cogito

class KeyStoreMock: KeyStore {
    static func create(path: String, scryptN: Int, scryptP: Int) -> KeyStore {
        return KeyStoreMock(path: path, scryptN: scryptN, scryptP: scryptP)
    }

    let path: String
    let scryptN: Int
    let scryptP: Int

    init(path: String, scryptN: Int, scryptP: Int) {
        self.path = path
        self.scryptN = scryptN
        self.scryptP = scryptP
    }
}

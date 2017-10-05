//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Geth

class KeyStore: Codable {
    let path: String
    let scryptN: Int
    let scryptP: Int
    lazy var wrapped = GethKeyStore(path, scryptN: scryptN, scryptP: scryptP)
    let appPassword = AppPassword()

    required init(path: String, scryptN: Int, scryptP: Int) {
        self.path = path
        self.scryptN = scryptN
        self.scryptP = scryptP
    }

    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        path = try container.decode(type(of: self.path), forKey: .path)
        scryptN = try container.decode(type(of: self.scryptN), forKey: .scryptN)
        scryptP = try container.decode(type(of: self.scryptP), forKey: .scryptP)
    }

    func newAccount(onComplete: @escaping (_ account: GethAccount?, _ error: String?) -> Void) {
        print("[debug] creating new account in key store at \(path)")
        guard let gethKeyStore = wrapped else {
            onComplete(nil, "failed to open key store")
            return
        }
        appPassword.use { (password, error) in
            if let p = password {
                do {
                    let gethAccount = try gethKeyStore.newAccount(p)
                    onComplete(gethAccount, nil)
                } catch let e {
                    onComplete(nil, e.localizedDescription)
                }
            } else {
                onComplete(nil, error)
            }
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(path, forKey: .path)
        try container.encode(scryptN, forKey: .scryptN)
        try container.encode(scryptP, forKey: .scryptP)
    }

    enum CodingKeys: String, CodingKey {
        case path
        case scryptN
        case scryptP
    }
}

extension KeyStore: Equatable {
    static func == (lhs: KeyStore, rhs: KeyStore) -> Bool {
        return lhs.path == rhs.path && lhs.scryptN == rhs.scryptN && lhs.scryptP == rhs.scryptP
    }
}

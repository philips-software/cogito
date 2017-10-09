//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Geth

class KeyStore: Codable {
    let name: String
    let scryptN: Int
    let scryptP: Int
    lazy var wrapped = GethKeyStore(storeUrl.path, scryptN: scryptN, scryptP: scryptP)
    var storeUrl: URL {
        let base = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        return base.appendingPathComponent(name)
    }
    let appPassword = AppPassword()

    required init(name: String, scryptN: Int, scryptP: Int) {
        self.name = name
        self.scryptN = scryptN
        self.scryptP = scryptP
    }

    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        name = try container.decode(type(of: self.name), forKey: .name)
        scryptN = try container.decode(type(of: self.scryptN), forKey: .scryptN)
        scryptP = try container.decode(type(of: self.scryptP), forKey: .scryptP)
    }

    func reset() throws {
        if FileManager.default.fileExists(atPath: storeUrl.path) {
            try FileManager.default.removeItem(at: storeUrl)
        }
        try appPassword.reset()
        wrapped = nil
    }

    func newAccount(onComplete: @escaping (_ account: GethAccount?, _ error: String?) -> Void) {
        print("[debug] creating new account in key store at \(storeUrl)")
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
        try container.encode(name, forKey: .name)
        try container.encode(scryptN, forKey: .scryptN)
        try container.encode(scryptP, forKey: .scryptP)
    }

    enum CodingKeys: String, CodingKey {
        case name
        case scryptN
        case scryptP
    }
}

extension KeyStore: Equatable {
    static func == (lhs: KeyStore, rhs: KeyStore) -> Bool {
        return lhs.name == rhs.name && lhs.scryptN == rhs.scryptN && lhs.scryptP == rhs.scryptP
    }
}

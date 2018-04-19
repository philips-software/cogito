//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

struct PublicKeyLoader: PublicKeyLoaderType {
    func load(tag: String) -> PublicKey? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassKey,
            kSecAttrKeyClass as String: kSecAttrKeyClassPublic,
            kSecAttrApplicationTag as String: tag.data(using: .utf8)!,
            kSecMatchLimit as String: kSecMatchLimitOne,
            kSecReturnData as String: true
        ]
        var result: AnyObject?
        SecItemCopyMatching(query as CFDictionary, &result)
        return result as? Data
    }
}

protocol PublicKeyLoaderType {
    typealias PublicKey = Data

    func load(tag: String) -> PublicKey?
}

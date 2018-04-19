//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

struct Decrypter: DecrypterType {
    func decrypt(keyTag tag: String, cipherText: Data) -> Data? {
        guard let privateKey = loadPrivateKey(tag: tag) else {
            return nil
        }

        return SecKeyCreateDecryptedData(privateKey, .rsaEncryptionOAEPSHA512, cipherText as CFData, nil) as Data?
    }

    private func loadPrivateKey(tag: String) -> SecKey? {
        let query: [String:Any] = [
            kSecClass as String: kSecClassKey,
            kSecAttrKeyClass as String: kSecAttrKeyClassPrivate,
            kSecAttrApplicationTag as String: tag.data(using: .utf8)!,
            kSecMatchLimit as String: kSecMatchLimitOne,
            kSecReturnRef as String: true
        ]
        var queryResult: AnyObject?
        SecItemCopyMatching(query as CFDictionary, &queryResult)
        return queryResult as! SecKey? // swiftlint:disable:this force_cast
    }
}

protocol DecrypterType {
    func decrypt(keyTag: String, cipherText: Data) -> Data?
}

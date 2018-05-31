//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import SwiftyJSON
import base64url

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

    func loadJsonWebKey(tag: String) -> JsonWebKey? {
        guard let publicKey = load(tag: tag) else {
            return nil
        }

        let (modulus, exponent) = extractRSAParameters(publicKeyRSA2048Bits: publicKey)

        return JSON([
            "kty": "RSA",
            "n": modulus.base64urlEncodedString(),
            "e": exponent.base64urlEncodedString()
        ])
    }
}

func extractRSAParameters(publicKeyRSA2048Bits key: Data) -> (modulus: Data, exponent: Data) {
    // Simplified decoding of PKCS#1, see: https://stackoverflow.com/a/43225656
    var modulus = key.subdata(in: 8..<(key.count - 5))
    if modulus.count > 2048 / 8 {
        modulus.removeFirst()
    }
    let exponent = key.subdata(in: (key.count - 3)..<key.count)
    return (modulus, exponent)
}

protocol PublicKeyLoaderType {
    typealias PublicKey = Data
    typealias JsonWebKey = JSON

    func load(tag: String) -> PublicKey?
    func loadJsonWebKey(tag: String) -> JsonWebKey?
}

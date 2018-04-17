//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import Security

struct KeyPairCreator {
    var keyPairCreateFunction: KeyPairCreateFunction = SecKeyCreateRandomKey

    func create(tag: String) {
        let accessFlags = SecAccessControlCreateWithFlags(kCFAllocatorDefault,
                                                          kSecAttrAccessibleAfterFirstUnlock,
                                                          .userPresence,
                                                          nil)!
        let parameters: [String:Any] = [
            kSecAttrKeyType as String: kSecAttrKeyTypeRSA,
            kSecAttrKeySizeInBits as String: 2048,
            kSecPrivateKeyAttrs as String: [
                kSecAttrIsPermanent as String: true,
                kSecAttrCanEncrypt as String: true,
                kSecAttrCanDecrypt as String: true,
                kSecAttrApplicationTag as String: tag.data(using: .utf8)!,
                kSecAttrAccessControl as String: accessFlags
            ]
        ]
        _ = keyPairCreateFunction(parameters as CFDictionary, nil)
    }

    typealias KeyPairCreateFunction = (
        _ parameters: CFDictionary,
        _ error: UnsafeMutablePointer<Unmanaged<CFError>?>?
    ) -> SecKey?
}

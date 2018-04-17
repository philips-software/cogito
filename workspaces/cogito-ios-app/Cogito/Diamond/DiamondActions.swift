//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import Geth
import Security

struct DiamondActions {
    struct CreateFacet: Action {
        let description: String
        let account: GethAccount
    }

    struct DeleteFacet: Action {
        let uuid: UUID
    }

    struct SelectFacet: Action {
        let uuid: UUID
    }

    struct AddJWTAttestation: Action {
        let identity: Identity
        let idToken: String
    }

    struct CreateEncryptionKeyPair: Action {
        let identity: Identity
        let tag: String

        init(identity: Identity, keyPairCreateFunction: @escaping KeyPairCreateFunction = SecKeyCreateRandomKey) {
            self.identity = identity
            self.tag = UUID().uuidString
            var creator = KeyPairCreator()
            creator.keyPairCreateFunction = keyPairCreateFunction
            creator.create(tag: tag)
        }
    }
}

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
}

typealias KeyPairCreateFunction = (
    _ parameters: CFDictionary,
    _ error: UnsafeMutablePointer<Unmanaged<CFError>?>?
    ) -> SecKey?

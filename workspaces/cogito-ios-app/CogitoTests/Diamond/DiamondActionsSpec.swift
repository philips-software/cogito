//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class DiamondActionsSpec: QuickSpec {
    override func spec() {
        context("when creating a key pair") {
            let identity = Identity(description: "test identity", address: Address.testAddress1)
            var action: DiamondActions.CreateEncryptionKeyPair!
            var creationParameters: [String:Any]? = nil

            beforeEach {
                let keyPairCreateFunction: KeyPairCreateFunction = { parameters, error in
                    creationParameters = parameters as? [String:Any]
                    return nil
                }

                action = DiamondActions.CreateEncryptionKeyPair(
                    identity: identity,
                    keyPairCreateFunction: keyPairCreateFunction
                )
            }

            it("uses RSA algorithm") {
                expect(creationParameters?[kSecAttrKeyType as String] as? String) == kSecAttrKeyTypeRSA as String
                expect(creationParameters?[kSecAttrKeySizeInBits as String] as? Int) == 2048
            }

            it("is stored permanently") {
                let privateKeyAttributes = creationParameters?[kSecPrivateKeyAttrs as String] as? [String:Any]
                expect(privateKeyAttributes?[kSecAttrIsPermanent as String] as? Bool).to(beTrue())
            }

            it("can be used for encryption and decryption") {
                let privateKeyAttributes = creationParameters?[kSecPrivateKeyAttrs as String] as? [String:Any]
                expect(privateKeyAttributes?[kSecAttrCanEncrypt as String] as? Bool).to(beTrue())
                expect(privateKeyAttributes?[kSecAttrCanDecrypt as String] as? Bool).to(beTrue())
            }

            it("is stored under a tag") {
                let privateKeyAttributes = creationParameters?[kSecPrivateKeyAttrs as String] as? [String:Any]
                let tagData = privateKeyAttributes?[kSecAttrApplicationTag as String] as? Data
                expect(tagData) == action.tag.data(using: .utf8)
            }

            it("generates unique tags") {
                let tag1 = DiamondActions.CreateEncryptionKeyPair(identity: identity).tag
                let tag2 = DiamondActions.CreateEncryptionKeyPair(identity: identity).tag
                expect(tag1) != tag2
            }

            it("has access control flags") {
                let privateKeyAttributes = creationParameters?[kSecPrivateKeyAttrs as String] as? [String:Any]
                expect(privateKeyAttributes?[kSecAttrAccessControl as String]).toNot(beNil())
            }
        }
    }
}

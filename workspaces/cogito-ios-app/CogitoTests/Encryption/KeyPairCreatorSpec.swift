//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class KeyPairCreatorSpec: QuickSpec {
    override func spec() {
        var creator: KeyPairCreator!
        var creationParameters: [String:Any]? = nil

        beforeEach {
            creator = KeyPairCreator()
            creator.keyPairCreateFunction = { parameters, error in
                creationParameters = parameters as? [String:Any]
                return nil
            }
        }

        context("when creating") {
            let tag = "some tag"

            beforeEach {
                creator.create(tag: tag)
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
                expect(tagData) == tag.data(using: .utf8)
            }

            it("has access control flags") {
                let privateKeyAttributes = creationParameters?[kSecPrivateKeyAttrs as String] as? [String:Any]
                expect(privateKeyAttributes?[kSecAttrAccessControl as String]).toNot(beNil())
            }
        }
    }
}

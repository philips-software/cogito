import Quick
import Nimble
@testable import Cogito

class KeyPairCreatorSpec: QuickSpec {
    override func spec() {
        var creator: KeyPairCreator!

        beforeEach {
            creator = KeyPairCreator()
        }

        context("when creating") {
            let tag = UUID().uuidString

            beforeEach {
                creator.create(tag: tag)
            }

            it("uses RSA algorithm") {
                let query: [String: Any] = [
                    kSecAttrKeyType as String: kSecAttrKeyTypeRSA,
                    kSecAttrKeySizeInBits as String: 2048,
                    kSecAttrApplicationTag as String: tag.data(using: .utf8)!,
                    kSecClass as String: kSecClassKey
                ]
                expect(SecItemCopyMatching(query as CFDictionary, nil)) == errSecSuccess
            }

            it("can be used for encryption and decryption") {
                let query: [String: Any] = [
                    kSecAttrCanEncrypt as String: true,
                    kSecAttrCanDecrypt as String: true,
                    kSecAttrApplicationTag as String: tag.data(using: .utf8)!,
                    kSecClass as String: kSecClassKey
                ]
                expect(SecItemCopyMatching(query as CFDictionary, nil)) == errSecSuccess
            }
        }
    }
}

import Quick
import Nimble
@testable import Cogito

class DecrypterSepc: QuickSpec {
    override func spec() {
        var tag: String!
        var publicKey: SecKey!
        var plainText: Data!
        var cipherText: Data!

        beforeEach {
            tag = UUID().uuidString
            KeyPairCreator().create(tag: tag)
            publicKey = loadPublicKey(tag: tag)
            plainText = "some data".data(using: .utf8)
            cipherText = encrypt(key: publicKey, plainText: plainText)
        }

        it("decrypts data that was encrypted with the public key") {
            expect(Decrypter().decrypt(keyTag: tag, cipherText: cipherText)) == plainText
        }

        it("returns nil when key could not be found") {
            let nonExistent = UUID().uuidString
            expect(Decrypter().decrypt(keyTag: nonExistent, cipherText: cipherText)).to(beNil())
        }

        it("returns nil when data could not be decrypted") {
            let wrongCipherText = "invalid".data(using: .utf8)!
            expect(Decrypter().decrypt(keyTag: tag, cipherText: wrongCipherText)).to(beNil())
        }
    }
}

private func loadPublicKey(tag: String) -> SecKey? {
    let query: [String: Any] = [
        kSecClass as String: kSecClassKey,
        kSecAttrKeyClass as String: kSecAttrKeyClassPublic,
        kSecAttrApplicationTag as String: tag.data(using: .utf8)!,
        kSecReturnRef as String: true
    ]
    var queryResult: AnyObject?
    SecItemCopyMatching(query as CFDictionary, &queryResult)
    return queryResult as! SecKey? // swiftlint:disable:this force_cast
}

private func encrypt(key: SecKey, plainText: Data) -> Data? {
    let plainText = "some data".data(using: .utf8)!
    return SecKeyCreateEncryptedData(key, .rsaEncryptionOAEPSHA1, plainText as CFData, nil) as Data?
}

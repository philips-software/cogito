//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import Security
import SwiftyJSON
import base64url
@testable import Cogito

class PublicKeyLoaderSpec: QuickSpec {
    override func spec() {
        let tag = UUID().uuidString

        beforeEach {
            KeyPairCreator().create(tag: tag)
        }

        it("loads a previously created public key") {
            let query: [String: Any] = [
                kSecAttrKeyClass as String: kSecAttrKeyClassPublic,
                kSecReturnData as String: true as CFBoolean,
                kSecAttrApplicationTag as String: tag.data(using: .utf8)!,
                kSecClass as String: kSecClassKey
            ]
            var queryResult: AnyObject?
            SecItemCopyMatching(query as CFDictionary, &queryResult)
            let publicKey = queryResult as? Data

            expect(PublicKeyLoader().load(tag: tag)) == publicKey
        }

        it("returns nil when public key could not be found") {
            let nonExistent = UUID().uuidString
            expect(PublicKeyLoader().load(tag: nonExistent)).to(beNil())
        }

        context("when converting to Json Web Key format") {
            var publicKey: Data!
            var jwk: JSON!

            beforeEach {
                publicKey = PublicKeyLoader().load(tag: tag)
                let jwkString = PublicKeyLoader().loadJsonWebKey(tag: tag)!
                jwk = JSON(parseJSON: jwkString)
            }

            it("outputs the correct key type") {
                expect(jwk["kty"].string).to(equal("RSA"))
            }

            it("outputs the modulus in base64url encoding") {
                var modulus = publicKey.subdata(in: 8..<(publicKey.count - 5))
                if modulus.count > 2048 / 8 {
                    modulus.removeFirst()
                }
                expect(jwk["n"].string).to(equal(modulus.base64urlEncodedString()))
            }

            it("outputs the exponent in base64url encoding") {
                let exponent = publicKey.subdata(in: (publicKey.count - 3)..<publicKey.count)
                expect(jwk["e"].string).to(equal(exponent.base64urlEncodedString()))
            }
        }
    }
}

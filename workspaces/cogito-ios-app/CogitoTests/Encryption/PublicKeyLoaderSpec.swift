//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import Security
@testable import Cogito

class PublicKeyLoaderSpec: QuickSpec {
    override func spec() {
        let tag = UUID().uuidString

        it("loads a previously created public key") {
            KeyPairCreator().create(tag: tag)

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
    }
}

//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class DiamondActionsSpec: QuickSpec {
    override func spec() {
        context("when creating a key pair") {
            let identity = Identity(description: "test identity", address: Address.testAddress1)

            it("generates unique tags") {
                let tag1 = DiamondActions.CreateEncryptionKeyPair(identity: identity).tag
                let tag2 = DiamondActions.CreateEncryptionKeyPair(identity: identity).tag
                expect(tag1) != tag2
            }
        }
    }
}

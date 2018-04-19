//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

@testable import Cogito

class KeyPairCreatorSpy: KeyPairCreatorType {
    var createWasCalled = false
    var latestTag: String?

    func create(tag: String) {
        createWasCalled = true
        latestTag = tag
    }
}

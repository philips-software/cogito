//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

class KeyPairCreatorSpy: KeyPairCreatorType {
    var createWasCalled = false

    func create(tag: String) {
        createWasCalled = true
    }
}

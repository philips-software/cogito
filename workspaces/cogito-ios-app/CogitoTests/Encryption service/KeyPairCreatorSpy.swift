@testable import Cogito

class KeyPairCreatorSpy: KeyPairCreatorType {
    var createWasCalled = false
    var latestTag: String?

    func create(tag: String) {
        createWasCalled = true
        latestTag = tag
    }
}

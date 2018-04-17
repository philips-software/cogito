//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

class PublicKeyLoaderSpy: PublicKeyLoaderType {
    var publicKeyToReturn: PublicKey?
    var latestTag: String?

    func load(tag: String) -> PublicKey? {
        latestTag = tag
        return publicKeyToReturn
    }
}

@testable import Cogito

class PublicKeyLoaderSpy: PublicKeyLoaderType {
    var publicKeyToReturn: PublicKey?
    var jsonWebKeyToReturn: JsonWebKey?
    var latestTag: String?

    func load(tag: String) -> PublicKey? {
        latestTag = tag
        return publicKeyToReturn
    }

    func loadJsonWebKey(tag: String) -> JsonWebKey? {
        latestTag = tag
        return jsonWebKeyToReturn
    }
}

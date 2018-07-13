import Foundation
import JWTDecode

struct Identity: Codable {
    let identifier: UUID
    let description: String
    let address: Address
    let created: Date
    var openIDTokens: [String]
    var attestations: [String]
    var encryptionKeyPairs: [Tag]

    init(description: String, address: Address) {
        self.identifier = UUID()
        self.description = description
        self.address = address
        self.openIDTokens = []
        self.attestations = []
        self.created = Date()
        self.encryptionKeyPairs = []
    }

    func findOpenIDToken(claim: String, value: String) -> String? {
        if let index = self.openIDTokens.index(where: { $0.has(claim: claim, value: value) }) {
            return self.openIDTokens[index]
        } else {
            return nil
        }
    }

    typealias Tag = String
}

extension Identity: Equatable {
    static func == (lhs: Identity, rhs: Identity) -> Bool {
        return lhs.identifier == rhs.identifier &&
               lhs.description == rhs.description &&
               lhs.address == rhs.address &&
               lhs.openIDTokens == rhs.openIDTokens &&
               lhs.created == rhs.created &&
               lhs.encryptionKeyPairs == rhs.encryptionKeyPairs
    }
}

private extension String {
    func has(claim: String, value: String) -> Bool {
        do {
            let jwt = try JWTDecode.decode(jwt: self)
            return jwt.claim(name: claim).string == value
        } catch {
            return false
        }
    }
}

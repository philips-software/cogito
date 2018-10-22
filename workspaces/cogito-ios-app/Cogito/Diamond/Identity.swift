import Foundation
import JWTDecode

struct Identity: Codable {
    let identifier: UUID
    let description: String
    let address: Address
    let created: Date
    var attestations: [Attestation]
    var encryptionKeyPairs: [Tag]

    init(description: String, address: Address) {
        self.identifier = UUID()
        self.description = description
        self.address = address
        self.attestations = []
        self.created = Date()
        self.encryptionKeyPairs = []
    }

    func findOpenIDToken(claim: String, value: String) -> String? {
        return self.attestations.first {
            $0.isOidcToken && $0.value.has(claim: claim, value: value)
        }?.value
    }

    typealias Tag = String
}

extension Identity: Equatable {
    static func == (lhs: Identity, rhs: Identity) -> Bool {
        return lhs.identifier == rhs.identifier &&
               lhs.description == rhs.description &&
               lhs.address == rhs.address &&
               lhs.attestations == rhs.attestations &&
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

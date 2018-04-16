//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import JWTDecode

struct Identity: Codable {
    let identifier: UUID
    let description: String
    let address: Address
    let created: Date
    var idTokens: [String]
    var encryptionKeyPairs: [Tag]

    init(description: String, address: Address) {
        self.identifier = UUID()
        self.description = description
        self.address = address
        self.idTokens = []
        self.created = Date()
        self.encryptionKeyPairs = []
    }

    func findToken(claim: String, value: String) -> String? {
        if let index = self.idTokens.index(where: { $0.has(claim: claim, value: value) }) {
            return self.idTokens[index]
        } else {
            return nil
        }
    }

    typealias Tag = Data
}

extension Identity: Equatable {
    static func == (lhs: Identity, rhs: Identity) -> Bool {
        return lhs.identifier == rhs.identifier &&
               lhs.description == rhs.description &&
               lhs.address == rhs.address &&
               lhs.idTokens == rhs.idTokens &&
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

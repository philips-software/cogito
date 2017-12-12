//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import Geth
import JWTDecode

struct Identity: Codable {
    let identifier: UUID
    let description: String
    let address: Address
    var gethAddress: GethAddress { return address.toGethAddress() }
    var idTokens: [String]

    init(description: String, address: Address) {
        self.identifier = UUID()
        self.description = description
        self.address = address
        self.idTokens = []
    }

    func findToken(claim: String, value: String) -> String? {
        if let index = self.idTokens.index(where: { $0.has(claim: claim, value: value) }) {
            return self.idTokens[index]
        } else {
            return nil
        }
    }

}

extension Identity: Equatable {
    static func == (lhs: Identity, rhs: Identity) -> Bool {
        let leftHex = lhs.gethAddress.getHex()!
        let rightHex = rhs.gethAddress.getHex()!
        return lhs.identifier == rhs.identifier &&
               lhs.description == rhs.description &&
               leftHex == rightHex &&
               lhs.idTokens == rhs.idTokens
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

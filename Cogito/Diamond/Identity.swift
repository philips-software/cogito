//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Geth

struct Identity: Codable {
    let description: String
    let gethAddress: GethAddress

    init(description: String, gethAddress: GethAddress) {
        self.description = description
        self.gethAddress = gethAddress
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.description = try container.decode(String.self, forKey: .description)
        let hexAddress = try container.decode(String.self, forKey: .gethAddress)
        self.gethAddress = GethAddress(fromHex: hexAddress)
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(description, forKey: .description)
        try container.encode(gethAddress.getHex()!, forKey: .gethAddress)
    }

    enum CodingKeys: String, CodingKey {
        case description
        case gethAddress
    }
}

extension Identity: Equatable {
    static func == (lhs: Identity, rhs: Identity) -> Bool {
        let leftHex = lhs.gethAddress.getHex()!
        let rightHex = rhs.gethAddress.getHex()!
        return lhs.description == rhs.description && leftHex == rightHex
    }
}

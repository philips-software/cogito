//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Geth

struct CreateIdentityState: Codable {
    var description: String
    var pending: Bool
    var newAccount: GethAccount?
    var error: String?

    init(description: String, pending: Bool, newAccount: GethAccount?, error: String?) {
        self.description = description
        self.pending = pending
        self.newAccount = newAccount
        self.error = error
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        description = try container.decode(String.self, forKey: .description)
        pending = false
        newAccount = nil
        error = nil
    }

    enum CodingKeys: String, CodingKey {
        case description
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(description, forKey: .description)
    }
}

let initialCreateIdentityState = CreateIdentityState(
    description: "",
    pending: false,
    newAccount: nil,
    error: nil
)

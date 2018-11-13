import Geth

struct CreateIdentityState: Codable {
    var description: String
    var pending: Bool
    var newAddress: Address?
    var error: String?

    init(description: String, pending: Bool, newAddress: Address?, error: String?) {
        self.description = description
        self.pending = pending
        self.newAddress = newAddress
        self.error = error
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        description = try container.decode(String.self, forKey: .description)
        pending = false
        newAddress = nil
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

extension CreateIdentityState: Equatable {
    static func == (lhs: CreateIdentityState, rhs: CreateIdentityState) -> Bool {
        return lhs.description == rhs.description &&
               lhs.pending == rhs.pending &&
               lhs.newAddress == rhs.newAddress &&
               lhs.error == rhs.error
    }
}

let initialCreateIdentityState = CreateIdentityState(
    description: "",
    pending: false,
    newAddress: nil,
    error: nil
)

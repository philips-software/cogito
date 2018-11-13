import Foundation

struct Address: Codable {
    let value: String

    init?(fromHex hex: String) {
        guard hex.isValidEthereumAddress else {
            return nil
        }
        value = hex
    }

    init(from decoder: Decoder) throws {
        value = try String(from: decoder)
    }

    func encode(to encoder: Encoder) throws {
        try value.encode(to: encoder)
    }
}

extension String {
    var isValidEthereumAddress: Bool {
        return self.range(of: "^0x[a-fA-F0-9]{40}$", options: .regularExpression) != nil
    }
}

extension Address: CustomStringConvertible {
    var description: String {
        return value
    }
}

extension Address: Equatable {
    static func == (lhs: Address, rhs: Address) -> Bool {
        return lhs.value.lowercased() == rhs.value.lowercased()
    }
}

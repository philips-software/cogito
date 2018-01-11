//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

enum JsonRpcId {
    case number(Int)
    case string(String)
}

extension JsonRpcId {
    var number: Int? {
        switch self {
        case .number(let id):
            return id
        default:
            return nil
        }
    }

    var string: String? {
        switch self {
        case .string(let id):
            return id
        default:
            return nil
        }
    }
}

extension JsonRpcId: Codable {
    enum CodingError: Error {
        case decoding(String)
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()

        if let id = try? container.decode(Int.self) {
            self = .number(id)
            return
        }

        if let id = try? container.decode(String.self) {
            self = .string(id)
            return
        }

        throw CodingError.decoding("Unable to decode id: \(dump(container))")
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch self {
        case .number(let id):
            try container.encode(id)
        case .string(let id):
            try container.encode(id)
        }
    }
}

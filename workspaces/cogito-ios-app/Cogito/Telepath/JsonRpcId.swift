import SwiftyJSON

struct JsonRpcId {
    let json: JSON

    init() {
        json = JSON()
    }

    init(_ value: Int) {
        json = JSON(value)
    }

    init(_ value: String) {
        json = JSON(value)
    }

    init(json: JSON) {
        self.json = json
    }

    var int: Int? {
        return json.int
    }

    var string: String? {
        return json.string
    }

    var object: Any {
        return json.object
    }
}

extension JsonRpcId: Equatable {
    static func == (lhs: JsonRpcId, rhs: JsonRpcId) -> Bool {
        return lhs.json == rhs.json
    }
}

extension JsonRpcId: Codable {
    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let integer = try? container.decode(Int.self) {
            self.init(integer)
        } else if let string = try? container.decode(String.self) {
            self.init(string)
        } else {
            self.init()
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        if let integer = self.int {
            try container.encode(integer)
        } else if let string = self.string {
            try container.encode(string)
        } else {
            try container.encodeNil()
        }
    }
}

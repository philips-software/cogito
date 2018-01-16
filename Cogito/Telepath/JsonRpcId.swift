//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

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

extension JsonRpcId: Encodable {
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

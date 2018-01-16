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

    init(_ value: JSON) {
        json = value
    }

    var number: NSNumber? {
        return json.number
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

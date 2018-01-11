//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

struct JsonRpcRequest: Codable {
    let id: JsonRpcId?
    let method: String

    enum CodingKeys: String, CodingKey {
        case id
        case method
    }
}

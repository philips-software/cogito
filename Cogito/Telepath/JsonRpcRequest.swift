//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import SwiftyJSON

struct JsonRpcRequest {
    let id: JSON
    let method: String
    let params: JSON
}

extension JsonRpcRequest {
    init?(parse jsonString: String) {
        let json = JSON(parseJSON: jsonString)

        guard let method = json["method"].string else {
            return nil
        }

        let id = json["id"]
        let params = json["params"]

        self.init(id: id, method: method, params: params)
    }
}

extension JsonRpcRequest: Equatable {
    static func == (lhs: JsonRpcRequest, rhs: JsonRpcRequest) -> Bool {
        return
            lhs.id == rhs.id &&
            lhs.method == rhs.method &&
            lhs.params == rhs.params
    }
}

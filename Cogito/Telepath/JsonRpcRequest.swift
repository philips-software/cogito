//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import SwiftyJSON

struct JsonRpcRequest {
    let id: JSON
    let method: String
}

extension JsonRpcRequest {
    init?(parse jsonString: String) {
        let json = JSON(parseJSON: jsonString)

        guard let method = json["method"].string else {
            return nil
        }

        let id = json["id"]

        self.init(id: id, method: method)
    }
}

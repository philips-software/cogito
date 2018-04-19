//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

@testable import Cogito

extension JsonRpcRequest {
    init(method: String, params: JsonRpcParams = JsonRpcParams()) {
        self.init(id: JsonRpcId(), method: method, params: params)
    }
}

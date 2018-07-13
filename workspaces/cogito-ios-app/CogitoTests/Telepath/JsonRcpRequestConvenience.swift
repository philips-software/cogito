@testable import Cogito

extension JsonRpcRequest {
    init(method: String, params: JsonRpcParams = JsonRpcParams()) {
        self.init(id: JsonRpcId(), method: method, params: params)
    }
}

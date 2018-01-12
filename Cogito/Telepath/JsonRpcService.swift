//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

class JsonRpcService: TelepathService {
    override func onMessage(_ message: String) {
        if let request = JsonRpcRequest(parse: message) {
            onRequest(request)
        }
    }

    func onRequest(_ request: JsonRpcRequest) {}
}

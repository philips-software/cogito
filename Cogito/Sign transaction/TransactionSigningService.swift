//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct TransactionSigningService: NewTelepathService {
    let store: Store<AppState>

    func onRequest(_ request: JsonRpcRequest) {
        guard request.method == "sign" else {
            return
        }
        store.dispatch(TransactionSigningActions.Sign(tx: [:])) // todo: take from request
    }
}

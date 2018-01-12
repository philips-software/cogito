//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class TransactionSigningService: JsonRpcService {
    init(store: Store<AppState>) {
        super.init(store: store, method: "sign")
    }

    override func onRequest(_ request: JsonRpcRequest) {
        store.dispatch(TransactionSigningActions.Sign(tx: [:])) // todo: take from request
    }
}

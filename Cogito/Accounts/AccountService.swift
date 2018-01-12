//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class AccountService: JsonRpcService {
    init(store: Store<AppState>) {
        super.init(store: store, method: "accounts")
    }

    override func onRequest(_ request: JsonRpcRequest) {
        store.dispatch(AccountActions.GetAccounts(requestId: request.id))
    }
}

//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct AccountService: NewTelepathService {
    let store: Store<AppState>

    func onRequest(_ request: JsonRpcRequest) {
        guard request.method == "accounts" else {
            return
        }
        store.dispatch(AccountActions.GetAccounts(requestId: request.id))
    }
}

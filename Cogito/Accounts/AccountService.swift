//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class AccountService: TelepathService {
    init(store: Store<AppState>) {
        super.init(store: store, method: "accounts")
    }

    override func onMessage(_ message: String) {
        store.dispatch(AccountActions.GetAccounts())
    }
}

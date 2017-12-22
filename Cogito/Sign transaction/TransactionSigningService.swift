//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class TransactionSigningService: TelepathService {
    init(store: Store<AppState>) {
        super.init(store: store, method: "sign")
    }

    override func onMessage(_ message: String) {
        store.dispatch(TransactionSigningActions.Sign())
    }
}

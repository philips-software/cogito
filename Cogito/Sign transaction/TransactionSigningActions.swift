//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwiftThunk

struct TransactionSigningActions {
    // swiftlint:disable:next identifier_name
    static func Sign(tx: [String:Any]) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, getState in
            let builder = TransactionSignerBuilder(transaction: tx,
                                                   dispatch: dispatch,
                                                   getState: getState)
            builder.build().execute()
        })
    }
}

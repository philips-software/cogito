//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import ReSwiftThunk

// swiftlint:disable identifier_name
func ResetApp() -> ThunkAction<AppState> {
    return ThunkAction(action: { (dispatch, _) in
        // todo: delete old key store from disk
        // todo: delete keychain stuff

        dispatch(ResetAppState())
        dispatch(KeyStoreActions.create())
    })
}

struct ResetAppState: Action {}

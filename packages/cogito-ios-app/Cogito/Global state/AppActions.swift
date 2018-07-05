//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import ReSwiftThunk

// swiftlint:disable identifier_name
func ResetApp() -> ThunkAction<AppState> {
    return ThunkAction(action: { (dispatch, getState) in
        do {
            try getState()?.keyStore.keyStore?.reset()
        } catch let e {
            print("failed to reset app state: \(e)")
            abort()
        }
        dispatch(ResetAppState())
        dispatch(KeyStoreActions.Create())
    })
}

struct ResetAppState: Action {}

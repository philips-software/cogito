//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

func appReducer(action: Action, state: AppState?) -> AppState {
    if action is ResetAppState {
        return initialAppState
    } else {
        return AppState(
            keyStore: keyStoreReducer(action: action, state: state?.keyStore),
            geth: gethReducer(action: action, state: state?.geth),
            createIdentity: createIdentityReducer(action: action, state: state?.createIdentity),
            diamond: diamondReducer(action: action, state: state?.diamond)
        )
    }
}

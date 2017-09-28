//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import ReSwift

func appReducer(action: Action, state: AppState?) -> AppState {
    return AppState(
        keyStore: keyStoreReducer(action: action, state: state?.keyStore),
        geth: gethReducer(action: action, state: state?.geth)
    )
}

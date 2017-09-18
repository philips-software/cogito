//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import ReSwift

func appReducer(action: Action, state: AppState?) -> AppState {
    let state = state ?? initialAppState
    return state
}

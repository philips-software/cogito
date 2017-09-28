//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import ReSwift

func createIdentityReducer(action: Action, state: CreateIdentityState?) -> CreateIdentityState {
    let state = state ?? initialCreateIdentityState
    return state
}

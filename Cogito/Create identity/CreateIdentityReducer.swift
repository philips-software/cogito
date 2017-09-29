//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

func createIdentityReducer(action: Action, state: CreateIdentityState?) -> CreateIdentityState {
    var state = state ?? initialCreateIdentityState
    switch action {
        case let action as CreateIdentityActions.SetDescription:
            state.description = action.description
        case _ as CreateIdentityActions.Reset:
            state.description = ""
        default:
            break
    }
    return state
}

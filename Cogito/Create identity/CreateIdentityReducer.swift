//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

func createIdentityReducer(action: Action, state: CreateIdentityState?) -> CreateIdentityState {
    var state = state ?? initialCreateIdentityState
    switch action {
    case let action as CreateIdentityActions.SetDescription:
        state.description = action.description
    case _ as CreateIdentityActions.ResetForm:
        state.description = ""
        state.pending = false
        state.newAccount = nil
        state.error = nil
    case _ as CreateIdentityActions.Pending:
        state.pending = true
        state.newAccount = nil
        state.error = nil
    case let action as CreateIdentityActions.Fulfilled:
        state.newAccount = action.account
        state.pending = false
    case let action as CreateIdentityActions.Rejected:
        state.error = action.message
        state.pending = false
    default:
        break
    }
    return state
}

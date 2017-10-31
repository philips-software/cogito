//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

func attestationsReducer(action: Action, state: AttestationsState?) -> AttestationsState {
    var state = state ?? initialAttestationsState
    switch action {
    case let action as AttestationActions.Pending:
        state.open[action.nonce] = AttestationInProgress(nonce: action.nonce,
                                                         subject: action.subject,
                                                         identity: action.identity,
                                                         status: .pending,
                                                         error: nil)
    case let action as AttestationActions.Started:
        state.open[action.nonce]?.status = .started
    case let action as AttestationActions.StartRejected:
        state.open[action.nonce]?.status = .startRejected
        state.open[action.nonce]?.error = action.error
    default:
        break
    }
    return state
}

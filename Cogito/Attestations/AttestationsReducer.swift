//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

func attestationsReducer(action: Action, state: AttestationsState?) -> AttestationsState {
    var state = state ?? initialAttestationsState
    switch action {
    case let action as AttestationActions.Pending:
        state.pending[action.nonce] = PendingAttestation(nonce: action.nonce,
                                                         subject: action.subject,
                                                         identity: action.identity,
                                                         status: .pending)
    case let action as AttestationActions.Started:
        state.pending[action.nonce]?.status = .started
    default:
        break
    }
    return state
}

//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import ReSwift

func gethReducer(action: Action, state: GethState?) -> GethState {
    var state = state ?? initialGethState
    switch action {
    case let action as PeersUpdated:
        state.peersCount = action.count
    case let action as SyncProgressUpdated:
        state.syncProgress = action.progress
    default:
        break
    }
    return state
}

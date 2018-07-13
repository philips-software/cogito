import ReSwift

func gethReducer(action: Action, state: GethState?) -> GethState {
    var state = state ?? initialGethState
    switch action {
    case let action as PeersUpdated:
        state.peersCount = action.count
    case let action as SyncProgressUpdated:
        if action.progress == nil {
            if let lastProgress = state.syncProgress,
                lastProgress.current == lastProgress.total {
                state.syncProgress = nil
            }
        } else {
            state.syncProgress = action.progress
        }
    default:
        break
    }
    return state
}

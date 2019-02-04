import ReSwift
import Geth

func garbageBinReducer(action: Action, state: GarbageBinState?) -> GarbageBinState {
    var state = state ?? initialGarbageBinState
    switch action {
    case let add as GarbageBinActions.Add:
        var newBin = state.bin
        newBin[add.key] = add.value
        state.bin = newBin
    case let delete as GarbageBinActions.Delete:
        var newBin = state.bin
        newBin.removeValue(forKey: delete.key)
        state.bin = newBin
    default:
        break
    }
    return state
}

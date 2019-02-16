import ReSwift

func valueStoreReducer(action: Action, state: ValueStoreState?) -> ValueStoreState {
    var state = state ?? initialValueStoreState
    switch action {
    case let add as ValueStoreActions.Add:
        var newStore = state.store
        newStore[add.key] = add.value
        state.store = newStore
    case let delete as ValueStoreActions.Delete:
        var newStore = state.store
        newStore.removeValue(forKey: delete.key)
        state.store = newStore
    default:
        break
    }
    return state
}

import ReSwift

func dialogPresenterReducer(action: Action,
                            state: DialogPresenterState?) -> DialogPresenterState {
    let state = state ?? initialDialogPresenterState
    switch action {
        case _ as DialogPresenterActions.DidDismissAlert:
            var newState = state
            newState.requestedAlerts.remove(at: 0)
            return newState
        case let action as DialogPresenterActions.RequestAlert:
            var newState = state
            newState.requestedAlerts.append(action.requestedAlert)
            return newState
        default:
            return state
    }
}

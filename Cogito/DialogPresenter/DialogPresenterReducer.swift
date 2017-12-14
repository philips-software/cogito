import ReSwift

func dialogPresenterReducer(action: Action,
                            state: DialogPresenterState?) -> DialogPresenterState {
    return state ?? initialDialogPresenterState
}

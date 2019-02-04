import ReSwift

func appReducer(action: Action, state: AppState?) -> AppState {
    if action is ResetAppState {
        return initialAppState
    } else {
        return AppState(
            keyStore: keyStoreReducer(action: action, state: state?.keyStore),
            createIdentity: createIdentityReducer(action: action, state: state?.createIdentity),
            diamond: diamondReducer(action: action, state: state?.diamond),
            telepath: telepathReducer(action, state?.telepath),
            attestations: attestationsReducer(action: action, state: state?.attestations),
            dialogPresenter: dialogPresenterReducer(action: action, state: state?.dialogPresenter),
            garbage: garbageBinReducer(action: action, state: state?.garbage)
        )
    }
}

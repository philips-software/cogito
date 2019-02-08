import ReSwift
import ReSwiftThunk

// swiftlint:disable identifier_name
func ResetApp() -> Thunk<AppState> {
    return Thunk { (dispatch, getState) in
        do {
            try getState()?.keyStore.keyStore?.reset()
        } catch let e {
            print("failed to reset app state: \(e)")
            abort()
        }
        dispatch(ResetAppState())
        dispatch(KeyStoreActions.Create())
    }
}

struct ResetAppState: Action {}

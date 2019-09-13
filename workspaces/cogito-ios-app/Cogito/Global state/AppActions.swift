import ReSwift
import ReSwiftThunk

let resetAppNotification = Notification.Name("ResetApp")

// swiftlint:disable identifier_name
func ResetApp() -> Thunk<AppState> {
    return Thunk { (dispatch, getState) in
        do {
            try getState()?.keyStore.keyStore?.reset()
        } catch let e {
            print("failed to reset app state: \(e)")
            abort()
        }
        NotificationCenter.default.post(
            name: resetAppNotification, object: nil, userInfo: nil)
        dispatch(ResetAppState())
        dispatch(KeyStoreActions.Create())
    }
}

struct ResetAppState: Action {}

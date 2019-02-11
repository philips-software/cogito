import ReSwift
import ReSwiftThunk

// swiftlint:disable identifier_name
struct KeyStoreActions {
    static func Create() -> Thunk<AppState> {
        return Thunk { (dispatch, _) in
            let keyStore = KeyStore(name: "main.keystore")
            dispatch(Fulfilled(keyStore: keyStore))
        }
    }

    struct Fulfilled: Action {
        let keyStore: KeyStore
    }
}

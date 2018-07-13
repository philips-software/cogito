import ReSwift
import ReSwiftThunk
import Geth

// swiftlint:disable identifier_name
struct KeyStoreActions {
    static func Create() -> ThunkAction<AppState> {
        return ThunkAction(action: { (dispatch, _) in
            let keyStore = KeyStore(name: "main.keystore",
                                    scryptN: GethStandardScryptN / 4,
                                    scryptP: GethStandardScryptP)
            dispatch(Fulfilled(keyStore: keyStore))
        })
    }

    struct Fulfilled: Action {
        let keyStore: KeyStore
    }
}

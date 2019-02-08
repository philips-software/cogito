import ReSwift
import ReSwiftThunk

let standardScryptN = 1 << 18
let standardScryptP = 1

// swiftlint:disable identifier_name
struct KeyStoreActions {
    static func Create() -> Thunk<AppState> {
        return Thunk { (dispatch, _) in
            let keyStore = KeyStore(name: "main.keystore",
                                    scryptN: standardScryptN / 4,
                                    scryptP: standardScryptP)
            dispatch(Fulfilled(keyStore: keyStore))
        }
    }

    struct Fulfilled: Action {
        let keyStore: KeyStore
    }
}

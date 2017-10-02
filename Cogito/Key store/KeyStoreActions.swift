//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import ReSwiftThunk
import Geth

struct KeyStoreActions {
    static func create() -> ThunkAction<AppState> {
        return ThunkAction(action: { (dispatch, _) in
            let documentsDirectory = NSSearchPathForDirectoriesInDomains(.documentDirectory,
                                                                         .userDomainMask,
                                                                         true)[0]
            let keyStore = KeyStore(path: documentsDirectory + "/main.keystore",
                                    scryptN: GethStandardScryptN / 4,
                                    scryptP: GethStandardScryptP)
            dispatch(Fulfilled(keyStore: keyStore))
        })
    }

    struct Fulfilled: Action {
        let keyStore: KeyStore
    }
}

//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import ReSwiftThunk
import Geth

struct KeyStoreActions {
    let keyStoreType: KeyStore.Type

    init(_ keyStoreType: KeyStore.Type = GethKeyStore.self) {
        self.keyStoreType = keyStoreType
    }

    func create() -> ThunkAction<AppState> {
        return ThunkAction(action: { (dispatch, getState) in
            let documentsDirectory = NSSearchPathForDirectoriesInDomains(.documentDirectory,
                                                                         .userDomainMask,
                                                                         true)[0]
            let keyStore = self.keyStoreType.create(path: documentsDirectory,
                                                    scryptN: GethStandardScryptN,
                                                    scryptP: GethStandardScryptP)
            dispatch(Fulfilled(keyStore: keyStore))
        })
    }

    struct Fulfilled: Action {
        let keyStore: KeyStore
    }
}

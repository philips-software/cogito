//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct AppState: StateType, Codable {
    let keyStore: KeyStoreState
    let geth: GethState
}

let initialAppState = AppState(keyStore: initialKeyStoreState, geth: initialGethState)

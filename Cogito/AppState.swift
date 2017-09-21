//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct AppState: StateType, Codable {
    let keyStore: KeyStoreState
}

let initialAppState = AppState(keyStore: initialKeyStoreState)

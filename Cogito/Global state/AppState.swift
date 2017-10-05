//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct AppState: StateType, Codable {
    let keyStore: KeyStoreState
    let geth: GethState
    let createIdentity: CreateIdentityState
    let diamond: DiamondState
}

let initialAppState = AppState(
    keyStore: initialKeyStoreState,
    geth: initialGethState,
    createIdentity: initialCreateIdentityState,
    diamond: initialDiamondState
)

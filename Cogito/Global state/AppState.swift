//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct AppState: StateType, Codable {
    let keyStore: KeyStoreState
    let geth: GethState
    let createIdentity: CreateIdentityState
    let diamond: DiamondState
    let telepath: TelepathState
}

extension AppState: Equatable {
    static func == (lhs: AppState, rhs: AppState) -> Bool {
        return lhs.keyStore == rhs.keyStore &&
               lhs.geth == rhs.geth &&
               lhs.createIdentity == rhs.createIdentity &&
               lhs.diamond == rhs.diamond &&
               lhs.telepath == rhs.telepath
    }
}

let initialAppState = AppState(
    keyStore: initialKeyStoreState,
    geth: initialGethState,
    createIdentity: initialCreateIdentityState,
    diamond: initialDiamondState,
    telepath: initialTelepathState
)

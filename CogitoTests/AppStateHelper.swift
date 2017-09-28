//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Foundation

func appState(keyStore: KeyStoreState = initialKeyStoreState,
              geth: GethState = initialGethState,
              createIdentity: CreateIdentityState = initialCreateIdentityState) -> AppState {
    return AppState(keyStore: keyStore, geth: geth, createIdentity: createIdentity)
}

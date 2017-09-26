//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Foundation

func appState(keyStore: KeyStoreState = initialKeyStoreState,
              geth: GethState = initialGethState) -> AppState {
    return AppState(keyStore: keyStore, geth: geth)
}

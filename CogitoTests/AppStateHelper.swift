//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

func appState(keyStore: KeyStoreState = initialKeyStoreState,
              geth: GethState = initialGethState,
              createIdentity: CreateIdentityState = initialCreateIdentityState,
              diamond: DiamondState = initialDiamondState,
              telepath: TelepathState = initialTelepathState) -> AppState {
    return AppState(keyStore: keyStore,
                    geth: geth,
                    createIdentity: createIdentity,
                    diamond: diamond,
                    telepath: telepath)
}

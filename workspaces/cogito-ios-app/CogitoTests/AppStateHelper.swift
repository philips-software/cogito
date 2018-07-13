import Foundation
@testable import Cogito

func appState(keyStore: KeyStoreState = initialKeyStoreState,
              geth: GethState = initialGethState,
              createIdentity: CreateIdentityState = initialCreateIdentityState,
              diamond: DiamondState = initialDiamondState,
              telepath: TelepathState = initialTelepathState,
              attestations: AttestationsState = initialAttestationsState,
              dialogPresenter: DialogPresenterState = initialDialogPresenterState
              ) -> AppState {
    return AppState(keyStore: keyStore,
                    geth: geth,
                    createIdentity: createIdentity,
                    diamond: diamond,
                    telepath: telepath,
                    attestations: attestations,
                    dialogPresenter: dialogPresenter)
}

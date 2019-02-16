import Foundation
@testable import Cogito

func appState(keyStore: KeyStoreState = initialKeyStoreState,
              createIdentity: CreateIdentityState = initialCreateIdentityState,
              diamond: DiamondState = initialDiamondState,
              telepath: TelepathState = initialTelepathState,
              attestations: AttestationsState = initialAttestationsState,
              dialogPresenter: DialogPresenterState = initialDialogPresenterState,
              valueStore: ValueStoreState = initialValueStoreState
              ) -> AppState {
    return AppState(keyStore: keyStore,
                    createIdentity: createIdentity,
                    diamond: diamond,
                    telepath: telepath,
                    attestations: attestations,
                    dialogPresenter: dialogPresenter,
                    valueStore: valueStore)
}

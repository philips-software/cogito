import ReSwift

struct AppState: StateType, Codable {
    let keyStore: KeyStoreState
    let createIdentity: CreateIdentityState
    let diamond: DiamondState
    let telepath: TelepathState
    let attestations: AttestationsState
    let dialogPresenter: DialogPresenterState
}

extension AppState: Equatable {
    static func == (lhs: AppState, rhs: AppState) -> Bool {
        return lhs.keyStore == rhs.keyStore &&
               lhs.createIdentity == rhs.createIdentity &&
               lhs.diamond == rhs.diamond &&
               lhs.telepath == rhs.telepath &&
               lhs.attestations == rhs.attestations
    }
}

let initialAppState = AppState(
    keyStore: initialKeyStoreState,
    createIdentity: initialCreateIdentityState,
    diamond: initialDiamondState,
    telepath: initialTelepathState,
    attestations: initialAttestationsState,
    dialogPresenter: initialDialogPresenterState
)

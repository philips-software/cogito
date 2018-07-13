import ReSwift
import Geth

struct DiamondActions {
    struct CreateFacet: Action {
        let description: String
        let account: GethAccount
    }

    struct DeleteFacet: Action {
        let uuid: UUID
    }

    struct SelectFacet: Action {
        let uuid: UUID
    }

    struct StoreOpenIDAttestation: Action {
        let identity: Identity
        let idToken: String
    }

    struct StoreAttestation: Action {
        let identity: Identity
        let attestation: String
    }

    struct StoreEncryptionKeyPair: Action {
        let identity: Identity
        let tag: String
    }
}

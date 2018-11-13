import ReSwift

struct DiamondActions {
    struct CreateFacet: Action {
        let description: String
        let address: Address
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
        let attestation: Attestation
    }

    struct StoreEncryptionKeyPair: Action {
        let identity: Identity
        let tag: String
    }
}

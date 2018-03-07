//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

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

    struct AddJWTAttestation: Action {
        let identity: Identity
        let idToken: String
    }
}

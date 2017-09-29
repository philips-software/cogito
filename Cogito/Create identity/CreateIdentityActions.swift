//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct CreateIdentityActions {
    struct Reset: Action {}

    struct SetDescription: Action {
        let description: String
    }

    struct CreateIdentity: Action {}
}

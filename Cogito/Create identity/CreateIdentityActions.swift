//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct CreateIdentityActions {
    struct SetDescription: Action {
        let description: String
    }

    struct CreateIdentity: Action {}
}

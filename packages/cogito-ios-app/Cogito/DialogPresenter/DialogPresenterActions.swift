//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct DialogPresenterActions {
    struct DidDismissAlert: Action {}

    struct RequestAlert: Action {
        let requestedAlert: RequestedAlert
    }
}

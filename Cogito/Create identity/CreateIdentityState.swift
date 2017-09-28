//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

struct CreateIdentityState: Codable {
    let description: String
}

let initialCreateIdentityState = CreateIdentityState(description: "")

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

struct CreateIdentityState: Codable {
    var description: String
}

let initialCreateIdentityState = CreateIdentityState(description: "")

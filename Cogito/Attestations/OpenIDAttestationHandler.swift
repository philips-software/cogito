//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

typealias JWT = [String: Any]

struct OpenIDAttestationHandler {
    let oidcRealmUrl: URL
    let onSuccess: (JWT) -> Void
    let onError: (String) -> Void

    func run() {} // supposed to be blocking
}

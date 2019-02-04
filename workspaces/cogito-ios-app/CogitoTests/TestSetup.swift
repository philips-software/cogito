//  Copyright © 2019 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
@testable import Cogito

class TestSetup: NSObject {
    override init() {
        AudioFeedback.default.disabled = true
    }
}

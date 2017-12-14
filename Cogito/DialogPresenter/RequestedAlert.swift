//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import UIKit

struct RequestedAlert {
    let title: String
    let message: String
    let actions: [UIAlertAction]
}

extension RequestedAlert: Equatable {
    static func == (lhs: RequestedAlert, rhs: RequestedAlert) -> Bool {
        return lhs.title == rhs.title &&
               lhs.message == rhs.message &&
               lhs.actions.count == rhs.actions.count
    }
}

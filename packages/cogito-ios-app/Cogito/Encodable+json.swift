//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

extension Encodable {
    var json: String {
        let data = try? JSONEncoder().encode(self)
        return String(data: data!, encoding: .utf8)!
    }
}

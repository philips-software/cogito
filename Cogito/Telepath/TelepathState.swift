//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

struct TelepathState: Equatable, Codable {
    var connectUrl: URL?

    static func ==(lhs: TelepathState, rhs: TelepathState) -> Bool {
        return lhs.connectUrl == rhs.connectUrl
    }
}

let initialTelepathState = TelepathState()

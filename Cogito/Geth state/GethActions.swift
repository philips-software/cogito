//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct PeersUpdated: Action {
    let count: Int
}

struct SyncProgressUpdated: Action {
    let progress: SyncProgress?
}

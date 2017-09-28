//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

struct SyncProgress {
    let start: Int
    let current: Int
    let total: Int
}

extension SyncProgress: Equatable {
    static func == (lhs: SyncProgress, rhs: SyncProgress) -> Bool {
        return lhs.start == rhs.start && lhs.current == rhs.current && lhs.total == rhs.total
    }
}

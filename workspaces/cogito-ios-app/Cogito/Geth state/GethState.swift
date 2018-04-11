//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

struct GethState: Codable {
    var peersCount: Int
    var syncProgress: SyncProgress?

    init(peersCount: Int, syncProgress: SyncProgress?) {
        self.peersCount = peersCount
        self.syncProgress = syncProgress
    }

    init(from decoder: Decoder) throws {
        peersCount = 0
        syncProgress = nil
    }

    func encode(to encoder: Encoder) throws {}
}

extension GethState: Equatable {
    static func == (lhs: GethState, rhs: GethState) -> Bool {
        return lhs.peersCount == rhs.peersCount &&
               lhs.syncProgress == rhs.syncProgress
    }
}

let initialGethState = GethState(peersCount: 0, syncProgress: nil)

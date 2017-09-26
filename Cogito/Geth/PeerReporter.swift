//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Foundation

class PeerReporter {
    var onPeerCountAvailable: (_ peerCount: Int) -> Void = { _ in }
    let pollInterval: TimeInterval
    var timer: Timer?

    init(pollInterval: TimeInterval = 1) {
        self.pollInterval = pollInterval
    }

    func start() {
        timer = Timer.scheduledTimer(withTimeInterval: pollInterval, repeats: true) { [weak self] _ in
            self?.onPeerCountAvailable(0)
        }
    }
}

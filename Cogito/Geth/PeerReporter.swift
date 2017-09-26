//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Foundation

class PeerReporter {
    var onPeerCountAvailable: (_ peerCount: Int) -> Void = { _ in }
    let node: NodeType
    let pollInterval: TimeInterval
    var timer: Timer?

    init(node: NodeType, pollInterval: TimeInterval = 1) {
        self.node = node
        self.pollInterval = pollInterval
    }

    deinit {
        timer?.invalidate()
    }

    func start() {
        timer = Timer.scheduledTimer(withTimeInterval: pollInterval, repeats: true) { [weak self] _ in
            guard let this = self else { return }
            this.onPeerCountAvailable(this.node.peerCount)
        }
    }
}

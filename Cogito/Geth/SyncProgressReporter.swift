//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Foundation

class SyncProgressReporter {
    var onSyncProgressAvailable: (_ syncProgress: SyncProgress?) -> Void = { _ in }
    let ethereumClient: EthereumClientType
    let pollInterval: TimeInterval
    var timer: Timer?

    init(ethereumClient: EthereumClientType, pollInterval: TimeInterval) {
        self.ethereumClient = ethereumClient
        self.pollInterval = pollInterval
    }

    deinit {
        timer?.invalidate()
    }

    func start() {
        timer = Timer.scheduledTimer(withTimeInterval: pollInterval, repeats: true) { [weak self] _ in
            guard let this = self else { return }
            this.onSyncProgressAvailable(this.ethereumClient.syncProgress())
        }
    }
}

//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Geth

struct SyncProgress {
    let start: Int
    let current: Int
    let total: Int
}

protocol EthereumClientType {
    func syncProgress() -> SyncProgress?
}

class EthereumClient: EthereumClientType {
    let gethEthereumClient: GethEthereumClient
    let context: GethContext

    init(node: GethNode) throws {
        self.gethEthereumClient = try node.getEthereumClient()
        let halfASecond = NSEC_PER_SEC / 2
        self.context = GethContext().withTimeout(Int64(halfASecond))
    }

    func syncProgress() -> SyncProgress? {
        guard let progress = try? gethEthereumClient.syncProgress(context) else {
            return nil
        }
        return SyncProgress(start: Int(progress.getStartingBlock()),
                            current: Int(progress.getCurrentBlock()),
                            total: Int(progress.getHighestBlock()))
    }
}

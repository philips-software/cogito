//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Geth

protocol NodeType {
    var peerCount: Int { get }
}

class Node: NodeType {
    let dataDir: String
    let config: GethNodeConfig
    lazy var gethNode: GethNode = GethNode(dataDir, config: config)

    var peerCount: Int {
        return gethNode.getPeersInfo()!.size()
    }

    init(dataDir: String, config: GethNodeConfig) {
        self.dataDir = dataDir
        self.config = config
    }

    func start() throws {
        try gethNode.start()
    }
}

//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Geth

class Node {
    let dataDir: String
    let config: GethNodeConfig
    lazy var gethNode: GethNode = GethNode(dataDir, config: config)

    init(dataDir: String, config: GethNodeConfig) {
        self.dataDir = dataDir
        self.config = config
    }

    func start() throws {
        try gethNode.start()
    }
}

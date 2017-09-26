//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Geth

class Node {
    let dataDir: String
    let config: GethNodeConfig

    init(dataDir: String, config: GethNodeConfig) {
        self.dataDir = dataDir
        self.config = config
    }
}

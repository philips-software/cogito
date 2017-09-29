//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Geth

class Geth {
    enum NetworkID: Int64, CustomStringConvertible {
        case main = 1
        case ropsten = 3
        case rinkeby = 4

        var description: String {
            switch self {
            case .main:
                return "main"
            case .ropsten:
                return "ropsten"
            case .rinkeby:
                return "rinkeby"
            }
        }
    }

    let node: Node

    init() {
        let network: NetworkID = .rinkeby
        let cachesDir = NSSearchPathForDirectoriesInDomains(.cachesDirectory, .userDomainMask, true)[0]
        let dataDir = cachesDir + "/" + network.description
        let config = GethNodeConfig()!
        config.setEthereumNetworkID(network.rawValue)
        config.setEthereumGenesis(GethRinkebyGenesis())
        node = Node(dataDir: dataDir, config: config)
    }
}

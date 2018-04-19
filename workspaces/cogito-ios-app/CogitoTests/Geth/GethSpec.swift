//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import Geth
@testable import Cogito

class GethSpec: QuickSpec {
    override func spec() {
        var geth: Geth!

        beforeEach {
            geth = Geth()
        }

        it("uses the right data dir") {
            let cachesDir = NSSearchPathForDirectoriesInDomains(.cachesDirectory, .userDomainMask, true)[0]
            expect(geth.node.dataDir) == cachesDir + "/rinkeby"
        }

        it("configures for Rinkeby") {
            expect(geth.node.config.ethereumNetworkID()) == 4
            expect(geth.node.config.ethereumGenesis()) == GethRinkebyGenesis()
        }
    }
}

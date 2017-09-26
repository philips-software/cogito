//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class PeerReporterSpec: QuickSpec {
    override func spec() {
        it("reports the peer count repeatedly") {
            let reporter = PeerReporter(pollInterval: 0.001)
            var callbackCount = 0
            reporter.onPeerCountAvailable = { _ in
                callbackCount += 1
            }
            reporter.start()
            expect(callbackCount).toEventually(beGreaterThan(1))
        }
    }
}

import Quick
import Nimble
@testable import Cogito

class PeerReporterSpec: QuickSpec {
    override func spec() {
        var reporter: PeerReporter!
        var node: NodeStub!

        beforeEach {
            node = NodeStub()
            reporter = PeerReporter(node: node, pollInterval: 0.001)
        }

        it("retrieves the peer count") {
            var reportedCount: Int?
            node.peerCount = 42
            reporter.onPeerCountAvailable = { count in
                reportedCount = count
            }
            reporter.start()
            expect(reportedCount).toEventually(equal(42))
        }

        it("reports the peer count repeatedly") {
            var callbackCount = 0
            reporter.onPeerCountAvailable = { _ in
                callbackCount += 1
            }
            reporter.start()
            expect(callbackCount).toEventually(beGreaterThan(1))
        }
    }
}

class NodeStub: NodeType {
    var peerCount: Int = 0
}

import Quick
import Nimble
@testable import Cogito

class SyncProgressReporterSpec: QuickSpec {
    override func spec() {
        var reporter: SyncProgressReporter!
        var ethereumClient: EthereumClientStub!

        beforeEach {
            ethereumClient = EthereumClientStub()
            reporter = SyncProgressReporter(ethereumClient: ethereumClient, pollInterval: 0.001)
        }

        it("retrieves the sync progress") {
            var reportedStart: Int?
            var reportedCurrent: Int?
            var reportedTotal: Int?

            ethereumClient.theSyncProgress = SyncProgress(start: 42, current: 4242, total: 424242)
            reporter.onSyncProgressAvailable = { syncProgress in
                reportedStart = syncProgress!.start
                reportedCurrent = syncProgress!.current
                reportedTotal = syncProgress!.total
            }
            reporter.start()
            expect(reportedStart).toEventually(equal(42))
            expect(reportedCurrent).toEventually(equal(4242))
            expect(reportedTotal).toEventually(equal(424242))
        }

        it("reports the peer count repeatedly") {
            var callbackCount = 0
            ethereumClient.theSyncProgress = SyncProgress(start: 0, current: 0, total: 0)
            reporter.onSyncProgressAvailable = { _ in
                callbackCount += 1
            }
            reporter.start()
            expect(callbackCount).toEventually(beGreaterThan(1))
        }

        it("reports no sync progress when not syncing") {
            var reported: SyncProgress? = SyncProgress(start: 0, current: 0, total: 0)
            reporter.onSyncProgressAvailable = { syncProgress in
                reported = syncProgress
            }
            reporter.start()
            expect(reported).toEventually(beNil())
        }
    }
}

class EthereumClientStub: EthereumClientType {
    var theSyncProgress: SyncProgress?

    func syncProgress() -> SyncProgress? {
        return theSyncProgress
    }
}

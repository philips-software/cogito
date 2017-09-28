//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import UIKit

class ViewControllerSpec: QuickSpec {
    override func spec() {
        var viewController: ViewController!

        beforeEach {
            let storyboard = UIStoryboard(name: "Main", bundle: Bundle(for: type(of: self)))
            // swiftlint:disable:next force_cast
            viewController = storyboard.instantiateInitialViewController() as! ViewController
            expect(viewController.view).toNot(beNil())
        }

        it("show no progress bar and idle label when sync progress is nil") {
            let state = appState(geth: GethState(peersCount: 0, syncProgress: nil))
            viewController.connection.newState(state: state)
            expect(viewController.syncProgressBar.isHidden).to(beTrue())
            expect(viewController.syncProgressLabel.text) == "idle"
        }

        it("shows progress bar and label when sync progress is not nil") {
            let start = 100
            let cur = 500
            let total = 1000
            let syncProgress = SyncProgress(start: start, current: cur, total: total)
            let state = appState(geth: GethState(peersCount: 0, syncProgress: syncProgress))
            viewController.connection.newState(state: state)
            expect(viewController.syncProgressBar.isHidden).to(beFalse())
            expect(viewController.syncProgressBar.progress) == Float(cur-start)/Float(total-start)
            expect(viewController.syncProgressLabel.text) == "- \(total-cur)"
        }

        it("show the peer count") {
            let state = appState(geth: GethState(peersCount: 42, syncProgress: nil))
            viewController.connection.newState(state: state)
            expect(viewController.peerCountLabel.text) == "42"
        }
    }
}

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import UIKit

class DebugViewControllerSpec: QuickSpec {
    override func spec() {
        var viewController: DebugViewController!

        beforeEach {
            let storyboard = UIStoryboard(name: "Debug", bundle: Bundle(for: type(of: self)))
            // swiftlint:disable:next force_cast
            viewController = storyboard.instantiateInitialViewController() as! DebugViewController
            expect(viewController.view).toNot(beNil())
        }

        it("show proper UI when sync progress is nil") {
            let state = appState(geth: GethState(peersCount: 0, syncProgress: nil))
            viewController.connection.newState(state: state)
            expect(viewController.syncProgressBar.isHidden).to(beTrue())
            expect(viewController.syncActivityIndicator.isHidden).to(beTrue())
            expect(viewController.syncProgressLabel.text) == "idle"
        }

        it("shows proper UI when sync progress is not nil") {
            let start = 100
            let cur = 500
            let total = 1000
            let syncProgress = SyncProgress(start: start, current: cur, total: total)
            let state = appState(geth: GethState(peersCount: 0, syncProgress: syncProgress))
            viewController.connection.newState(state: state)
            expect(viewController.syncProgressBar.isHidden).to(beFalse())
            expect(viewController.syncActivityIndicator.isHidden).to(beFalse())
            expect(viewController.syncProgressBar.progress) == Float(cur-start)/Float(total-start)
            let percentage = String(format: "%.2f", 100 * syncProgress.fractionComplete)
            expect(viewController.syncProgressLabel.text) == "- \(total-cur) (\(percentage)%)"
        }

        it("show the peer count") {
            let state = appState(geth: GethState(peersCount: 42, syncProgress: nil))
            viewController.connection.newState(state: state)
            expect(viewController.peerCountLabel.text) == "42"
        }

        it("calls reset action when opening createIdentity view controller") {
            var resetCalled = false
            viewController.connection.actions = DebugViewController.Actions(
                resetCreateIdentity: { resetCalled = true },
                resetAppState: {}
            )
            let storyboard = UIStoryboard(name: "Debug", bundle: Bundle(for: type(of: self)))
            let createIdentityViewController = storyboard.instantiateViewController(withIdentifier: "CreateIdentity")
                as! CreateIdentityViewController // swiftlint:disable:this force_cast
            let segue = UIStoryboardSegue(identifier: nil,
                                          source: viewController,
                                          destination: createIdentityViewController)
            viewController.prepare(for: segue, sender: nil)
            expect(resetCalled).to(beTrue())
        }
    }
}

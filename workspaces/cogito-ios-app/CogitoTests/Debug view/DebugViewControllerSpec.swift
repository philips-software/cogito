import Quick
import Nimble
import UIKit
@testable import Cogito

class DebugViewControllerSpec: QuickSpec {
    override func spec() {
        var viewController: DebugViewController!

        beforeEach {
            let storyboard = UIStoryboard(name: "Debug", bundle: Bundle(for: DebugViewController.self))
            viewController = storyboard.instantiateInitialViewController() as? DebugViewController
            expect(viewController.view).toNot(beNil())
        }

        it("calls reset action when opening createIdentity view controller") {
            var resetCalled = false
            viewController.connection.actions = DebugViewController.Actions(
                resetCreateIdentity: { resetCalled = true },
                resetAppState: {},
                startOpenIdConnectAttestation: { _, _, _, _ in }
            )
            let storyboard = UIStoryboard(name: "Debug", bundle: Bundle(for: CreateIdentityViewController.self))
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

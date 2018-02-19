//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class IdentityManagerViewControllerSpec: QuickSpec {
    override func spec() {
        var identityManagerController: IdentityManagerViewController!

        beforeEach {
            let storyboard = UIStoryboard(name: "IdentityManager", bundle: Bundle(for: type(of: self)))
            let vc = storyboard.instantiateViewController(withIdentifier: "IdentityManager")
            identityManagerController = vc as? IdentityManagerViewController
            expect(vc.view).toNot(beNil())
        }

        it("resets create identity when showing the create identity form") {
            var reset = false
            identityManagerController.actions = IdentityManagerViewController.Actions(
                resetCreateIdentity: { reset = true }
            )
            let createIdentityController = CreateIdentityViewController()
            let segue = UIStoryboardSegue(identifier: "CreateIdentity",
                                          source: identityManagerController,
                                          destination: createIdentityController)
            identityManagerController.prepare(for: segue, sender: nil)
            createIdentityController.onDone()
            expect(reset).toEventually(beTrue())
        }

        describe("Map dispatch to actions") {
            var store: RecordingStore!

            beforeEach {
                store = RecordingStore()
                identityManagerController.connection.store = store
            }

            it("maps resetCreateIdentity") {
                identityManagerController.actions.resetCreateIdentity()
                expect(store.firstAction(ofType: CreateIdentityActions.ResetForm.self)).toNot(beNil())
            }
        }
    }
}

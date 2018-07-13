import Quick
import Nimble
import UIKit
import Geth
@testable import Cogito

class CreateIdentityViewControllerSpec: QuickSpec {
    override func spec() {
        var viewController: CreateIdentityViewController!

        beforeEach {
            let storyboard = UIStoryboard(name: "Debug", bundle: Bundle(for: CreateIdentityViewController.self))
            viewController = storyboard.instantiateViewController(withIdentifier: "CreateIdentity")
                as! CreateIdentityViewController // swiftlint:disable:this force_cast
            expect(viewController.view).toNot(beNil())
        }

        func createIdentityState(description: String = "",
                                 pending: Bool = false,
                                 newAccount: GethAccount? = nil,
                                 error: String? = nil) -> CreateIdentityState {
            return CreateIdentityState(description: description,
                                       pending: pending,
                                       newAccount: newAccount,
                                       error: error)
        }

        it("enables/disables create button based on entered description") {
            var state = appState(createIdentity: createIdentityState(description: ""))
            viewController.connection.newState(state: state)
            expect(viewController.createButton.isEnabled).to(beFalse())
            state = appState(createIdentity: createIdentityState(description: "me"))
            viewController.connection.newState(state: state)
            expect(viewController.createButton.isEnabled).to(beTrue())
        }

        it("sets the description based on the state") {
            let state = appState(createIdentity: createIdentityState(description: "me"))
            viewController.connection.newState(state: state)
            expect(viewController.descriptionField.text) == "me"
        }

        it("triggers action when editing ends") {
            var descriptionSet: String?
            viewController.connection.actions = CreateIdentityViewController.Actions(
                setDescription: { desc in descriptionSet = desc },
                createIdentity: {}
            )
            viewController.descriptionField.text = "me"
            viewController.editingChanged()
            expect(descriptionSet) == "me"
        }

        it("triggers action when create button is tapped") {
            var actionCalled = false
            viewController.connection.actions = CreateIdentityViewController.Actions(
                setDescription: { _ in },
                createIdentity: { actionCalled = true })
            viewController.createTapped()
            expect(actionCalled).to(beTrue())
        }

        it("triggers onDone when cancel button is tapped") {
            var done = false
            viewController.onDone = {
                done = true
            }
            viewController.cancelTapped()
            expect(done).to(beTrue())
        }

        it("triggers onDone when fulfilled") {
            var done = false
            viewController.onDone = {
                done = true
            }
            let state = appState(createIdentity: createIdentityState(newAccount: GethAccount()))
            viewController.connection.newState(state: state)
            expect(done).to(beTrue())
        }
    }
}

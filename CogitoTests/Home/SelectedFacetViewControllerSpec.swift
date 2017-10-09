//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import UIKit
import Geth
import ReSwift

class SelectedFacetViewControllerSpec: QuickSpec {
    override func spec() {
        var viewController: SelectedFacetViewController!

        beforeEach {
            let storyboard = UIStoryboard(name: "Home", bundle: Bundle(for: type(of: self)))
            viewController = storyboard.instantiateViewController(withIdentifier: "SelectedFacet")
                as! SelectedFacetViewController // swiftlint:disable:this force_cast
            expect(viewController.view).toNot(beNil())
        }

        describe("map state to props") {
            it("maps selected facet when there is no facet") {
                let state = appState(diamond: DiamondState(facets: []))
                viewController.connection.newState(state: state)
                expect(viewController.props.selectedFacet).to(beNil())
            }

            it("maps selected facet when there is one") {
                let address = GethAddress(fromHex: "0x0000000000000000000000000000000000000000")!
                let identity = Identity(description: "test", gethAddress: address)
                let state = appState(diamond: DiamondState(facets: [identity]))
                viewController.connection.newState(state: state)
                expect(viewController.props.selectedFacet) == identity
            }
        }

        describe("map dispatch to actions") {
            var testStore: Store<AppState>!

            beforeEach {
                testStore = Store<AppState>(reducer: { (_, _) in return initialAppState }, state: nil)
                viewController.connection.store = testStore
            }

            it("maps resetCreateIdentity") {
                let dispatchRecorder = DispatchRecorder<CreateIdentityActions.Reset>()
                testStore.dispatchFunction = dispatchRecorder.dispatch
                viewController.actions.resetCreateIdentity()
                expect(dispatchRecorder.count) == 1
            }
        }

        context("when selectedFacet is nil") {
            beforeEach {
                viewController.props = SelectedFacetViewController.Props(selectedFacet: nil)
            }

            it("has correct header button title and is touchable") {
                expect(viewController.headerButton.title(for: .normal)) == "Who am I?"
                expect(viewController.headerButton.isUserInteractionEnabled).to(beTrue())
            }
        }

        context("when selectedFacet is not nil") {
            beforeEach {
                let identity = Identity(description: "test",
                                        gethAddress: GethAddress())
                viewController.props = SelectedFacetViewController.Props(selectedFacet: identity)
            }

            it("has correct header button title and is not touchable") {
                expect(viewController.headerButton.title(for: .normal)) == "I am."
                expect(viewController.headerButton.isUserInteractionEnabled).to(beFalse())
            }
        }

        it("resets create identity when wizard is started") {
            var resetCalled = false
            viewController.connection.actions = SelectedFacetViewController.Actions(resetCreateIdentity: {
                resetCalled = true
            })
            viewController.whoAmITouched()
            expect(resetCalled).to(beTrue())
        }
    }
}

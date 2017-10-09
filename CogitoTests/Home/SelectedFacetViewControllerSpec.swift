//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import UIKit
import Geth
import ReSwift

class SelectedFacetViewControllerSpec: QuickSpec {
    override func spec() {
        let testAddress = GethAddress(fromHex: "0x0000000000000000000000000000000000000000")!
        let testIdentity = Identity(description: "testdesc",
                                    gethAddress: testAddress)
        var viewController: SelectedFacetViewController!

        beforeEach {
            let storyboard = UIStoryboard(name: "Home", bundle: Bundle(for: type(of: self)))
            viewController = storyboard.instantiateViewController(withIdentifier: "SelectedFacet")
                as! SelectedFacetViewController // swiftlint:disable:this force_cast
            expect(viewController.view).toNot(beNil())
        }

        describe("map state to props") {
            it("maps selectedFacet when there is no facet") {
                let state = appState(diamond: DiamondState(facets: []))
                viewController.connection.newState(state: state)
                expect(viewController.props.selectedFacet).to(beNil())
            }

            it("maps selectedFacet when there is one") {
                let state = appState(diamond: DiamondState(facets: [testIdentity]))
                viewController.connection.newState(state: state)
                expect(viewController.props.selectedFacet) == testIdentity
            }

            it("maps createdNewAccount when there is none") {
                let state = appState(createIdentity: CreateIdentityState(description: "testdesc",
                                                                         pending: true,
                                                                         newAccount: nil,
                                                                         error: nil))
                viewController.connection.newState(state: state)
                expect(viewController.props.createdNewAccount).to(beNil())
            }

            it("maps createdNewAcount when there is one") {
                let state = appState(createIdentity: CreateIdentityState(description: "testdesc",
                                                                         pending: false,
                                                                         newAccount: GethAccount()!,
                                                                         error: nil))
                viewController.connection.newState(state: state)
                expect(viewController.props.createdNewAccount).toNot(beNil())
            }

            it("maps facets") {
                let state = appState(diamond: DiamondState(facets: [testIdentity]))
                viewController.connection.newState(state: state)
                expect(viewController.props.facets) == [testIdentity]
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
                viewController.props = SelectedFacetViewController.Props(
                    selectedFacet: nil,
                    createdNewAccount: nil,
                    facets: [])
            }

            it("has correct header button title and is touchable") {
                expect(viewController.headerButton.title(for: .normal)) == "Who am I?"
                expect(viewController.headerButton.isUserInteractionEnabled).to(beTrue())
            }

            it("has empty facet label and facet label is hidden") {
                expect(viewController.facetLabel.text) == ""
                expect(viewController.facetLabel.isHidden).to(beTrue())
            }
        }

        context("when selectedFacet is not nil") {
            beforeEach {
                viewController.props = SelectedFacetViewController.Props(
                    selectedFacet: testIdentity,
                    createdNewAccount: nil,
                    facets: [testIdentity, testIdentity])
            }

            it("has correct header button title and is not touchable") {
                expect(viewController.headerButton.title(for: .normal)) == "I am."
                expect(viewController.headerButton.isUserInteractionEnabled).to(beFalse())
            }

            it("has facet label and facet label is visible") {
                expect(viewController.facetLabel.text) == "testdesc"
                expect(viewController.facetLabel.isHidden).to(beFalse())
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

        it("knows if the first facets was just created") {
            viewController.props = SelectedFacetViewController.Props(selectedFacet: nil,
                                                                     createdNewAccount: nil,
                                                                     facets: [])
            expect(viewController.firstFacetWasCreated()).to(beFalse())

            viewController.props = SelectedFacetViewController.Props(selectedFacet: testIdentity,
                                                                     createdNewAccount: nil,
                                                                     facets: [testIdentity])
            expect(viewController.firstFacetWasCreated()).to(beFalse())

            viewController.props = SelectedFacetViewController.Props(selectedFacet: testIdentity,
                                                                     createdNewAccount: GethAccount()!,
                                                                     facets: [testIdentity])
            expect(viewController.firstFacetWasCreated()).to(beTrue())

            viewController.props = SelectedFacetViewController.Props(selectedFacet: testIdentity,
                                                                     createdNewAccount: GethAccount()!,
                                                                     facets: [testIdentity, testIdentity])
            expect(viewController.firstFacetWasCreated()).to(beFalse())
        }
    }
}

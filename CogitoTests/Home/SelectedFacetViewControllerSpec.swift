//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import UIKit
import Geth

class SelectedFacetViewControllerSpec: QuickSpec {
    override func spec() {
        var viewController: SelectedFacetViewController!

        beforeEach {
            let storyboard = UIStoryboard(name: "Home", bundle: Bundle(for: type(of: self)))
            viewController = storyboard.instantiateViewController(withIdentifier: "SelectedFacet")
                as! SelectedFacetViewController // swiftlint:disable:this force_cast
            expect(viewController.view).toNot(beNil())
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

    }
}

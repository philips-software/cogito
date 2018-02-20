//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import UIKit

class ExplanationViewControllerSpec: QuickSpec {
    override func spec() {
        var viewController: ExplanationViewController!

        beforeEach {
            let storyboard = UIStoryboard(name: "SignTransaction", bundle: Bundle(for: type(of: self)))
            viewController = storyboard.instantiateViewController(withIdentifier: "Explanation")
                as! ExplanationViewController // swiftlint:disable:this force_cast
            expect(viewController.view).toNot(beNil())
        }

        context("when attestation is not needed") {
            let appName = "Test App"
            let actionDescription = "perform some test action"

            beforeEach {
                viewController.props = ExplanationViewController.Props(
                    appName: appName,
                    actionDescription: actionDescription
                )
            }

            it("shows explanatory text") {
                let expectedText = "\(appName) requests your signature to \(actionDescription)."
                expect(viewController.explanationLabel.text) == expectedText
            }
        }
    }
}

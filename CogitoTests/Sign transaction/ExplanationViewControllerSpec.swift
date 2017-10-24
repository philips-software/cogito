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
                    actionDescription: actionDescription,
                    organization: nil,
                    hasValidAttestation: nil
                )
            }

            it("shows explanatory text") {
                let expectedText = "\(appName) requires your signature to \(actionDescription)."
                expect(viewController.explanationLabel.text) == expectedText
            }

            it("does not show startAttestation button") {
                expect(viewController.startAttestationButton.isHidden).to(beTrue())
            }

            it("configures the sign and reject buttons") {
                expect(viewController.signButton.isEnabled).to(beTrue())
                expect(viewController.signButton.backgroundColor) == ExplanationViewController.signColor
                expect(viewController.rejectButton.isEnabled).to(beTrue())
                expect(viewController.rejectButton.backgroundColor) == ExplanationViewController.rejectColor
            }
        }

        context("when attestation is needed") {
            let appName = "Test App"
            let actionDescription = "perform some test action"
            let organization = "Philips"

            beforeEach {
                viewController.props = ExplanationViewController.Props(
                    appName: appName,
                    actionDescription: actionDescription,
                    organization: organization,
                    hasValidAttestation: false
                )
            }

            it("shows requirement to prove identity with IAM") {
                let expectedText = """
                                   \(appName) requires your signature to \(actionDescription).

                                   In addition, \(appName) requires proof that you have an account with \(organization).
                                   """
                expect(viewController.explanationLabel.text) == expectedText
            }

            it("shows startAttestation button") {
                expect(viewController.startAttestationButton.isHidden).to(beFalse())
            }

            it("configures the sign and reject buttons") {
                expect(viewController.signButton.isEnabled).to(beFalse())
                expect(viewController.signButton.backgroundColor) == ExplanationViewController.signDisabledColor
                expect(viewController.rejectButton.isEnabled).to(beFalse())
                expect(viewController.rejectButton.backgroundColor) == ExplanationViewController.rejectDisabledColor
            }

            context("when attestation available") {
                beforeEach {
                    viewController.props = ExplanationViewController.Props(
                        appName: appName,
                        actionDescription: actionDescription,
                        organization: organization,
                        hasValidAttestation: true
                    )
                }

                it("does not show startAttestation button") {
                    expect(viewController.startAttestationButton.isHidden).to(beTrue())
                }

                it("configures the sign and reject buttons") {
                    expect(viewController.signButton.isEnabled).to(beTrue())
                    expect(viewController.signButton.backgroundColor) == ExplanationViewController.signColor
                    expect(viewController.rejectButton.isEnabled).to(beTrue())
                    expect(viewController.rejectButton.backgroundColor) == ExplanationViewController.rejectColor
                }
            }
        }
    }
}

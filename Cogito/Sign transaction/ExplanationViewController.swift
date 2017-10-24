//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import ReRxSwift
import ReSwift

class ExplanationViewController: UIViewController, Connectable {

    static let signColor = UIColor(red: 0.816, green: 0.259, blue: 0.196, alpha: 1)
    static let rejectColor = UIColor(red: 0.111, green: 0.749, blue: 0.247, alpha: 1)
    static let signDisabledColor = UIColor.lightGray
    static let rejectDisabledColor = UIColor.gray

    @IBOutlet weak var explanationLabel: UILabel!
    @IBOutlet weak var startAttestationButton: UIButton!
    @IBOutlet weak var signButton: UIButton!
    @IBOutlet weak var rejectButton: UIButton!

    override func viewDidLoad() {
        super.viewDidLoad()
        connection.subscribe(\Props.appName) { _ in self.configureExplanation() }
        connection.subscribe(\Props.actionDescription) { _ in  self.configureExplanation() }
        connection.subscribe(\Props.hasValidAttestation) { _ in self.configureButtons() }
    }

    func configureExplanation() {
        var text = "\(props.appName) requires your signature to \(props.actionDescription)."
        if let org = props.organization {
            text += "\n\nIn addition, \(props.appName) requires proof that you have an account"
            text += " with \(org)."
        }
        explanationLabel.text = text
    }

    func configureButtons() {
        let canSign = props.hasValidAttestation ?? true
        if canSign {
            signButton.backgroundColor = ExplanationViewController.signColor
            rejectButton.backgroundColor = ExplanationViewController.rejectColor
        } else {
            signButton.backgroundColor = ExplanationViewController.signDisabledColor
            rejectButton.backgroundColor = ExplanationViewController.rejectDisabledColor
        }
        signButton.isEnabled = canSign
        rejectButton.isEnabled = canSign
        startAttestationButton.isHidden = canSign
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        connection.connect()
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        connection.disconnect()
    }

    @IBAction func cancel(_ sender: Any) {
        dismiss(animated: true, completion: {})
    }

    @IBAction func startAttestation() {
        actions.startAttestation()
    }

    @IBAction func sign() {
        actions.sign()
    }

    @IBAction func reject() {
        actions.reject()
    }

    struct Props {
        let appName: String
        let actionDescription: String
        let organization: String?
        let hasValidAttestation: Bool?
    }

    struct Actions {
        let sign: () -> Void
        let reject: () -> Void
        let startAttestation: () -> Void
    }

    let connection = Connection(store: appStore,
                                mapStateToProps: mapStateToProps,
                                mapDispatchToActions: mapDispatchToActions)
}

private func mapStateToProps(state: AppState) -> ExplanationViewController.Props {
    return ExplanationViewController.Props(
        appName: "Sample App",
        actionDescription: "perform some sample action",
        organization: "Sample Organization",
        hasValidAttestation: false
    )
}

private func mapDispatchToActions(dispatch: DispatchFunction) -> ExplanationViewController.Actions {
    return ExplanationViewController.Actions(
        sign: { print("not implemented yet") },
        reject: { print("not implemented yet") },
        startAttestation: { print("not implemented yet") }
    )
}

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import ReRxSwift
import ReSwift

class ExplanationViewController: UIViewController, Connectable {

    @IBOutlet weak var explanationLabel: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()
        connection.subscribe(\Props.appName) { _ in self.configureExplanation() }
        connection.subscribe(\Props.actionDescription) { _ in  self.configureExplanation() }
    }

    func configureExplanation() {
        explanationLabel.text = "\(props.appName) requires your signature to \(props.actionDescription)."
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

    struct Props {
        let appName: String
        let actionDescription: String
    }
    struct Actions {}
    let connection = Connection(store: appStore,
                                mapStateToProps: mapStateToProps,
                                mapDispatchToActions: mapDispatchToActions)
}

private func mapStateToProps(state: AppState) -> ExplanationViewController.Props {
    return ExplanationViewController.Props(
        appName: "Sample App",
        actionDescription: "perform some sample action"
    )
}

private func mapDispatchToActions(dispatch: DispatchFunction) -> ExplanationViewController.Actions {
    return ExplanationViewController.Actions()
}

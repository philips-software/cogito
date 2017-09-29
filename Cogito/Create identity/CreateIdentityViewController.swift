//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import ReSwift
import ReRxSwift

class CreateIdentityViewController: UIViewController, Connectable {

    @IBOutlet weak var descriptionField: UITextField!
    @IBOutlet weak var createButton: UIButton!

    var onDone: () -> Void = {}

    override func viewDidLoad() {
        super.viewDidLoad()
        connection.bind(\Props.description, to: createButton.rx.isEnabled) { $0 != "" }
        connection.bind(\Props.description, to: descriptionField.rx.text)
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        connection.connect()
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        connection.disconnect()
    }

    @IBAction func editingChanged() {
        actions.setDescription(descriptionField.text ?? "")
    }

    @IBAction func createTapped() {
        actions.createIdentity()
        onDone()
    }

    @IBAction func cancelTapped() {
        onDone()
    }

    struct Props {
        let description: String
    }
    struct Actions {
        let setDescription: (String) -> Void
        let createIdentity: () -> Void
    }
    let connection = Connection(store: appStore,
                                mapStateToProps: mapStateToProps,
                                mapDispatchToActions: mapDispatchToActions)
}

private func mapStateToProps(state: AppState) -> CreateIdentityViewController.Props {
    return CreateIdentityViewController.Props(description: state.createIdentity.description)
}

private func mapDispatchToActions(dispatch: @escaping DispatchFunction) -> CreateIdentityViewController.Actions {
    return CreateIdentityViewController.Actions(
        setDescription: { desc in dispatch(CreateIdentityActions.SetDescription(description: desc)) },
        createIdentity: { dispatch(CreateIdentityActions.CreateIdentity()) }
    )
}

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import ReSwift
import ReRxSwift

class CreateIdentityViewController: UIViewController, Connectable {

    @IBOutlet weak var descriptionField: UITextField!
    @IBOutlet weak var createButton: UIButton!
    @IBOutlet weak var closeButton: UIButton?

    @IBInspectable var showCloseButton: Bool = false {
        didSet {
            closeButton?.isHidden = !showCloseButton
        }
    }

    var onDone: () -> Void = {}

    override func viewDidLoad() {
        super.viewDidLoad()
        connection.bind(\Props.description, to: createButton.rx.isEnabled) { $0 != "" }
        connection.bind(\Props.description, to: descriptionField.rx.text)
        connection.subscribe(\Props.fulfilled) { [unowned self] fulfilled in
            if fulfilled {
                self.onDone()
            }
        }
        connection.subscribe(\Props.error) { [unowned self] error in
            if let e = error {
                print("[error] createIdentity error: \(e)")
                let alert = UIAlertController(
                    title: "Failed to create identity",
                    message: "Not sure why this happened. The only options I can give" +
                             " are to retry or contact the developer, I'm afraid.",
                    preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "Dismiss", style: .cancel))
                self.present(alert, animated: true)
            }
        }
    }

    override func prepareForInterfaceBuilder() {
        super.prepareForInterfaceBuilder()
        closeButton?.isHidden = !showCloseButton
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        closeButton?.isHidden = !showCloseButton
        connection.connect()
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        connection.disconnect()
    }

    @IBAction func editingChanged() {
        actions.setDescription(descriptionField.text ?? "")
    }

    @IBAction func editingDidEnd() {
        actions.setDescription(descriptionField.text ?? "")
    }

    @IBAction func createTapped() {
        descriptionField.resignFirstResponder()
        self.actions.createIdentity()
    }

    @IBAction func cancelTapped() {
        onDone()
    }

    struct Props {
        let description: String
        let pending: Bool
        let fulfilled: Bool
        let error: String?
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
    return CreateIdentityViewController.Props(
        description: state.createIdentity.description,
        pending: state.createIdentity.pending,
        fulfilled: state.createIdentity.newAccount != nil,
        error: state.createIdentity.error
    )
}

private func mapDispatchToActions(dispatch: @escaping DispatchFunction) -> CreateIdentityViewController.Actions {
    return CreateIdentityViewController.Actions(
        setDescription: { desc in dispatch(CreateIdentityActions.SetDescription(description: desc)) },
        createIdentity: { dispatch(CreateIdentityActions.CreateIdentity()) }
    )
}

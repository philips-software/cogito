import UIKit
import ReSwift
import ReRxSwift

class CreateIdentityViewController: UIViewController, Connectable {

    @IBOutlet weak var descriptionField: UITextField!
    @IBOutlet weak var createButton: UIButton!
    @IBOutlet weak var closeButton: UIButton?
    @IBOutlet weak var progressView: UIProgressView!

    @IBInspectable var showCloseButton: Bool = false {
        didSet {
            closeButton?.isHidden = !showCloseButton
        }
    }

    var onDone: () -> Void = {}

    override func viewDidLoad() {
        super.viewDidLoad()
        connection.bind(\Props.description, to: descriptionField.rx.text)
        connection.bind(\Props.createButtonEnabled, to: createButton.rx.isEnabled)
        connection.bind(\Props.pending, to: descriptionField.rx.isEnabled) { !$0 }
        connection.bind(\Props.pending, to: progressView.rx.isHidden) { !$0 }
        connection.bind(\Props.pending, to: createButton.rx.title()) {
            $0 ? "Creating" : "Create"
        }
        connection.bind(\Props.progress, to: progressView.rx.progress)
        connection.subscribe(\Props.fulfilled) { [unowned self] fulfilled in
            if fulfilled {
                self.onDone()
            }
        }
        connection.subscribe(\Props.error) { [unowned self] maybeError in
            if let error = maybeError {
                print("[error] createIdentity error: \(error)")
                let alert = UIAlertController(
                    title: "Failed to create identity",
                    message: "Please make sure you have a passcode set on your device, and retry.",
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
        let progress: Float
        let fulfilled: Bool
        let error: String?
        let createButtonEnabled: Bool
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
        progress: state.createIdentity.progress,
        fulfilled: state.createIdentity.newAddress != nil,
        error: state.createIdentity.error,
        createButtonEnabled:
            state.createIdentity.description != "" &&
            !state.createIdentity.pending
    )
}

private func mapDispatchToActions(dispatch: @escaping DispatchFunction) -> CreateIdentityViewController.Actions {
    return CreateIdentityViewController.Actions(
        setDescription: { desc in dispatch(CreateIdentityActions.SetDescription(description: desc)) },
        createIdentity: { dispatch(CreateIdentityActions.CreateIdentity()) }
    )
}

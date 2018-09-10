import UIKit
import ReSwift
import ReRxSwift

class DebugViewController: UIViewController, Connectable {

    @IBOutlet weak var oidcRealmUrlField: UITextField!
    @IBOutlet weak var oidcSubjectField: UITextField!

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        connection.connect()
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        connection.disconnect()
    }

    let connection = Connection(
        store: appStore,
        mapStateToProps: mapStateToProps,
        mapDispatchToActions: mapDispatchToActions)

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let child = segue.destination as? CreateIdentityViewController {
            actions.resetCreateIdentity()
            child.onDone = {
                child.dismiss(animated: true)
            }
        }
    }

    @IBAction func close() {
        dismiss(animated: true)
    }

    @IBAction func resetAppState() {
        actions.resetAppState()
        dismiss(animated: true)
    }

    @IBAction func startOidcAttestation() {
        guard let urlText = oidcRealmUrlField.text,
              let url = URL(string: urlText) else {
            print("invalid OpenID Connect URL")
            return
        }
        let subject: Subject?
        if let text = oidcSubjectField.text, !text.isEmpty {
            subject = text
        } else {
            subject = nil
        }
        guard let identity = props.selectedIdentity else {
            print("no identity was selected")
            return
        }
        actions.startOpenIdConnectAttestation(identity, JsonRpcId(), url, subject)
    }

    struct Props {
        let selectedIdentity: Identity?
    }
    struct Actions {
        let resetCreateIdentity: () -> Void
        let resetAppState: () -> Void
        let startOpenIdConnectAttestation: (Identity, JsonRpcId, URL, String?) -> Void
    }
}

private func mapStateToProps(state: AppState) -> DebugViewController.Props {
    return DebugViewController.Props(
        selectedIdentity: state.diamond.selectedFacet()
    )
}

private func mapDispatchToActions(dispatch: @escaping DispatchFunction) -> DebugViewController.Actions {
    return DebugViewController.Actions(
        resetCreateIdentity: { dispatch(CreateIdentityActions.ResetForm()) },
        resetAppState: { dispatch(ResetApp()) },
        startOpenIdConnectAttestation: { identity, requestId, url, subject in
            dispatch(OpenIDAttestationActions.StartAttestation(
                for: identity,
                requestId: requestId,
                oidcRealmUrl: url,
                subject: subject
            ))
        }
    )
}

import UIKit
import ReSwift
import ReRxSwift

class DebugViewController: UIViewController, Connectable {

    @IBOutlet weak var peerCountLabel: UILabel!
    @IBOutlet weak var syncProgressLabel: UILabel!
    @IBOutlet weak var syncProgressBar: UIProgressView!
    @IBOutlet weak var syncActivityIndicator: UIActivityIndicatorView!
    @IBOutlet weak var oidcRealmUrlField: UITextField!
    @IBOutlet weak var oidcSubjectField: UITextField!

    override func viewDidLoad() {
        super.viewDidLoad()
        connection.bind(\Props.peerCount, to: peerCountLabel.rx.text) { String($0) }
        connection.bind(\Props.syncProgress, to: syncProgressLabel.rx.text) { (maybe: SyncProgress?) -> String in
            guard let progress = maybe else { return "idle" }
            let remaining = progress.total - progress.current
            let percentage = String(format: "%.2f", 100.0 * progress.fractionComplete)
            return "- \(remaining) (\(percentage)%)"
        }
        connection.bind(\Props.syncProgress, to: syncProgressBar.rx.isHidden) { $0 == nil }
        connection.bind(\Props.syncProgress, to: syncActivityIndicator.rx.isAnimating) { $0 != nil }
        connection.bind(\Props.syncProgress, to: syncProgressBar.rx.progress) { maybeProgress in
            guard let progress = maybeProgress else { return 0 }
            return progress.fractionComplete
        }
    }

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
        let peerCount: Int
        let syncProgress: SyncProgress?
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
        peerCount: state.geth.peersCount,
        syncProgress: state.geth.syncProgress,
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

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import ReSwift
import ReRxSwift

class DebugViewController: UIViewController, Connectable {

    @IBOutlet weak var peerCountLabel: UILabel!
    @IBOutlet weak var syncProgressLabel: UILabel!
    @IBOutlet weak var syncProgressBar: UIProgressView!
    @IBOutlet weak var syncActivityIndicator: UIActivityIndicatorView!
    @IBOutlet weak var oidcRealmUrlField: UITextField!

    override func viewDidLoad() {
        super.viewDidLoad()
        connection.bind(\Props.peerCount, to: peerCountLabel.rx.text) { String($0) }
        connection.bind(\Props.syncProgress, to: syncProgressLabel.rx.text) { progress in
            guard let p = progress else { return "idle" }
            return "- \(p.total - p.current) (\(String(format: "%.2f", 100.0 * p.fractionComplete))%)"
        }
        connection.bind(\Props.syncProgress, to: syncProgressBar.rx.isHidden) { $0 == nil }
        connection.bind(\Props.syncProgress, to: syncActivityIndicator.rx.isAnimating) { $0 != nil }
        connection.bind(\Props.syncProgress, to: syncProgressBar.rx.progress) { progress in
            guard let p = progress else { return 0 }
            return p.fractionComplete
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
        guard let text = oidcRealmUrlField.text,
              let url = URL(string: text) else {
            print("invalid OpenID Connect URL")
            return
        }
        actions.startOpenIdConnectAttestation(url)
    }

    struct Props {
        let peerCount: Int
        let syncProgress: SyncProgress?
    }
    struct Actions {
        let resetCreateIdentity: () -> Void
        let resetAppState: () -> Void
        let startOpenIdConnectAttestation: (URL) -> Void
    }
}

private func mapStateToProps(state: AppState) -> DebugViewController.Props {
    return DebugViewController.Props(
        peerCount: state.geth.peersCount,
        syncProgress: state.geth.syncProgress
    )
}

private func mapDispatchToActions(dispatch: @escaping DispatchFunction) -> DebugViewController.Actions {
    return DebugViewController.Actions(
        resetCreateIdentity: { dispatch(CreateIdentityActions.Reset()) },
        resetAppState: { dispatch(ResetApp()) },
        startOpenIdConnectAttestation: { url in
            dispatch(AttestationActions().StartAttestation(oidcRealmUrl: url))
        }
    )
}

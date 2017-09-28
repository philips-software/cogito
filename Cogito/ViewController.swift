//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import UIKit
import ReSwift
import ReRxSwift

class ViewController: UIViewController, Connectable {

    @IBOutlet weak var peerCountLabel: UILabel!
    @IBOutlet weak var syncProgressLabel: UILabel!
    @IBOutlet weak var syncProgressBar: UIProgressView!

    override func viewDidLoad() {
        super.viewDidLoad()
        connection.bind(\Props.peerCount, to: peerCountLabel.rx.text) { String($0) }
        connection.bind(\Props.syncProgress, to: syncProgressLabel.rx.text) { progress in
            guard let p = progress else { return "idle" }
            return "- \(p.total - p.current)"
        }
        connection.bind(\Props.syncProgress, to: syncProgressBar.rx.isHidden) { $0 == nil }
        connection.bind(\Props.syncProgress, to: syncProgressBar.rx.progress) { progress in
            guard let p = progress else { return 0 }
            return Float(p.current - p.start) / Float(p.total - p.start)
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

    struct Props {
        let peerCount: Int
        let syncProgress: SyncProgress?
    }
    struct Actions {}
}

private func mapStateToProps(state: AppState) -> ViewController.Props {
    return ViewController.Props(
        peerCount: state.geth.peersCount,
        syncProgress: state.geth.syncProgress
    )
}

private func mapDispatchToActions(dispatch: DispatchFunction) -> ViewController.Actions {
    return ViewController.Actions()
}

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import UIKit
import ReSwift
import ReRxSwift

protocol WindowType: class {
    func makeKeyAndVisible()
    var rootViewController: UIViewController? { get set }
    var isHidden: Bool { get set }
    var windowLevel: UIWindowLevel { get set }
    var isKeyWindow: Bool { get }
}

extension UIWindow: WindowType {}

class DialogPresenter: UIViewController, Connectable {
    lazy var alertWindow: WindowType = {
        let alertWindow = UIWindow(frame: UIScreen.main.bounds)
        DialogPresenter.configure(alertWindow: alertWindow)
        return alertWindow
    }()

    static func configure(alertWindow: WindowType) {
        alertWindow.rootViewController = UIViewController()
        alertWindow.windowLevel = UIWindowLevelAlert + 1
        alertWindow.isHidden = true
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        connection.subscribe(\Props.requestedAlerts) { requestedAlerts in
            guard requestedAlerts.count > 0 else { return }
            self.presentAlert(requestedAlert: requestedAlerts[0])
        }
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        connection.connect()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        connection.disconnect()
    }

    func presentAlert(requestedAlert: RequestedAlert) {
        let alert = UIAlertController(title: requestedAlert.title,
                                      message: requestedAlert.message,
                                      preferredStyle: .alert)
        for action in requestedAlert.actions {
            let alertAction = UIAlertAction(
                title: action.title,
                style: action.style) { _ in
                self.handleAlertAction(action: action)
            }
            alert.addAction(alertAction)
            if action.style == .default {
                alert.preferredAction = alertAction
            }
        }

        self.alertWindow.makeKeyAndVisible()
        self.alertWindow.rootViewController?.present(alert, animated: true)
    }

    func handleAlertAction(action: AlertAction) {
        self.alertWindow.isHidden = true
        action.handler?(action)
        self.actions.didDismissAlert()
    }

    let connection = Connection(store: appStore,
                                mapStateToProps: mapStateToProps,
                                mapDispatchToActions: mapDispatchToActions)

    struct Props {
        let requestedAlerts: [RequestedAlert]
    }
    struct Actions {
        let didDismissAlert: () -> Void
    }
}

private func mapStateToProps(state: AppState) -> DialogPresenter.Props {
    return DialogPresenter.Props(requestedAlerts: state.dialogPresenter.requestedAlerts)
}

private func mapDispatchToActions(dispatch: @escaping DispatchFunction) -> DialogPresenter.Actions {
    return DialogPresenter.Actions(
        didDismissAlert: { dispatch(DialogPresenterActions.DidDismissAlert()) }
    )
}

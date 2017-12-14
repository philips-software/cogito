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
        let alert = UIAlertController(title: requestedAlert.title, message: requestedAlert.message, preferredStyle: .alert)
        for action in requestedAlert.actions {
            alert.addAction(action)
        }

        self.alertWindow.makeKeyAndVisible()
        self.alertWindow.rootViewController?.present(alert, animated: true)
    }

    let connection = Connection(store: appStore,
                                mapStateToProps: mapStateToProps,
                                mapDispatchToActions: mapDispatchToActions)

    struct Props {
        let requestedAlerts: [RequestedAlert]
    }
    struct Actions {
    }
}

private func mapStateToProps(state: AppState) -> DialogPresenter.Props {
    return DialogPresenter.Props(requestedAlerts: [])
}

private func mapDispatchToActions(dispatch: @escaping DispatchFunction) -> DialogPresenter.Actions {
    return DialogPresenter.Actions()
}

struct RequestedAlert {
    let title: String
    let message: String
    let actions: [UIAlertAction]
}

extension RequestedAlert: Equatable {
    static func == (lhs: RequestedAlert, rhs: RequestedAlert) -> Bool {
        return lhs.title == rhs.title &&
               lhs.message == rhs.message &&
               lhs.actions.count == rhs.actions.count
    }
}

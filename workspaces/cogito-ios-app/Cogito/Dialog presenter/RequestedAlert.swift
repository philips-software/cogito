import Foundation
import UIKit

struct RequestedAlert {
    let title: String
    let message: String
    let actions: [AlertAction]
    let textFieldConfigurator: ((UITextField) -> Void)?

    init(title: String, message: String, actions: [AlertAction],
         textFieldConfigurator: ((UITextField) -> Void)? = nil) {
        self.title = title
        self.message = message
        self.actions = actions
        self.textFieldConfigurator = textFieldConfigurator
    }
}

extension RequestedAlert: Equatable {
    static func == (lhs: RequestedAlert, rhs: RequestedAlert) -> Bool {
        return lhs.title == rhs.title &&
               lhs.message == rhs.message &&
               lhs.actions.count == rhs.actions.count
    }
}

struct AlertAction {
    let title: String
    let style: UIAlertAction.Style
    let handler: ((AlertAction) -> Void)?

    init(title: String, style: UIAlertAction.Style, handler: ((AlertAction) -> Void)? = nil) {
        self.title = title
        self.style = style
        self.handler = handler
    }
}

extension AlertAction: Equatable {
    static func == (lhs: AlertAction, rhs: AlertAction) -> Bool {
        return lhs.title == rhs.title && lhs.style == rhs.style
    }
}

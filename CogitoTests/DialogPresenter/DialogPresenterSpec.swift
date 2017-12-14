//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import UIKit

class DialogPresenterSpec: QuickSpec {
    override func spec() {
        var viewController: DialogPresenter!
        var windowSpy: WindowSpy!

        beforeEach {
            let storyboard = UIStoryboard(name: "Home", bundle: Bundle(for: type(of: self)))
            viewController = storyboard.instantiateViewController(withIdentifier: "DialogPresenter")
                as! DialogPresenter // swiftlint:disable:this force_cast
            expect(viewController.view).toNot(beNil())
            windowSpy = WindowSpy()
            DialogPresenter.configure(alertWindow: windowSpy)
            viewController.alertWindow = windowSpy
        }

        it("has a window for presenting dialogs") {
            expect(viewController.alertWindow).toNot(beNil())
            expect(viewController.alertWindow.rootViewController).toNot(beNil())
            expect(viewController.alertWindow.windowLevel) == UIWindowLevelAlert + 1
            expect(viewController.alertWindow.isHidden).to(beTrue())
        }

        it("can present an alert") {
            viewController.alertWindow.rootViewController = ViewControllerPartialMock()
            let actions = [UIAlertAction(title: "test", style: .default)]
            viewController.props = DialogPresenter.Props(requestedAlerts: [
                RequestedAlert(title: "test title",
                               message: "test message",
                               actions: actions)
            ])
            let window: WindowType = viewController.alertWindow
            expect(window.isHidden).to(beFalse())
            expect(window.isKeyWindow).to(beTrue())
            // swiftlint:disable:next force_cast
            let alert = window.rootViewController!.presentedViewController as! UIAlertController
            expect(alert).toNot(beNil())
            expect(alert.actions) == actions
        }

        it("maps state to props") {
            let actions = [UIAlertAction(title: "test", style: .default)]
            let requestedAlert = RequestedAlert(title: "test title",
                                                message: "test message",
                                                actions: actions)
            let dialogState = DialogPresenterState(requestedAlerts: [requestedAlert])
            let state = appState(dialogPresenter: dialogState)
            viewController.connection.newState(state: state)
            expect(viewController.props.requestedAlerts) == [requestedAlert]
        }
    }
}

private class WindowSpy: WindowType {
    var rootViewController: UIViewController?
    var isHidden: Bool = false
    var isKeyWindow: Bool = false
    var windowLevel: UIWindowLevel = UIWindowLevelNormal
    init() {}
    func makeKeyAndVisible() {
        isHidden = false
        isKeyWindow = true
    }
}

private class ViewControllerPartialMock: UIViewController {
    var viewControllerToPresent: UIViewController?

    override var presentedViewController: UIViewController? {
        return viewControllerToPresent
    }

    override func present(_ viewControllerToPresent: UIViewController, animated flag: Bool, completion: (() -> Void)?) {
        self.viewControllerToPresent = viewControllerToPresent
    }
}

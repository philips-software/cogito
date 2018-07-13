import Quick
import Nimble
import UIKit
@testable import Cogito

class DialogPresenterSpec: QuickSpec {
    override func spec() {
        var viewController: DialogPresenter!
        var windowSpy: WindowSpy!

        beforeEach {
            let storyboard = UIStoryboard(name: "Home", bundle: Bundle(for: DialogPresenter.self))
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
            let actions = [AlertAction(title: "test", style: .default)]
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
            expect(alert.actions.count) == actions.count
            expect(alert.actions.first?.title) == actions.first?.title
            expect(alert.actions.first?.style) == actions.first?.style
        }

        context("when an alert action handler is called") {
            var actionTriggered = false

            beforeEach {
                windowSpy.isHidden = false
                let alertAction = AlertAction(title: "test", style: .default)
                viewController.actions = DialogPresenter.Actions(didDismissAlert: {
                    actionTriggered = true
                })
                actionTriggered = false
                viewController.handleAlertAction(action:alertAction)
            }

            it("triggers action when alert action handler is called") {
                expect(actionTriggered).to(beTrue())
            }

            it("hides the window when an alert action handler is called") {
                expect(windowSpy.isHidden).to(beTrue())
            }
        }
        it("maps state to props") {
            let actions = [AlertAction(title: "test", style: .default)]
            let requestedAlert = RequestedAlert(title: "test title",
                                                message: "test message",
                                                actions: actions)
            let dialogState = DialogPresenterState(requestedAlerts: [requestedAlert])
            let state = appState(dialogPresenter: dialogState)
            viewController.connection.newState(state: state)
            expect(viewController.props.requestedAlerts) == [requestedAlert]
        }

        it("maps dispatch to actions") {
            let storeSpy = StoreSpy()
            viewController.connection.store = storeSpy
            viewController.actions.didDismissAlert()
            expect(storeSpy.actions.last is DialogPresenterActions.DidDismissAlert).to(beTrue())
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

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
            viewController.props = DialogPresenter.Props(requestedAlerts: [
                RequestedAlert(title: "test title",
                               message: "test message",
                               actions: [])
            ])
            expect(viewController.alertWindow.isHidden).to(beFalse())
            expect(viewController.alertWindow.isKeyWindow).to(beTrue())
        }
    }
}

class WindowSpy: WindowType {
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

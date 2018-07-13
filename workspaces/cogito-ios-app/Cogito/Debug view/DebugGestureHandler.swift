import Foundation
import UIKit

class DebugGestureHandler {

    var gestureRecognizer: UIRotationGestureRecognizer?
    var debugger: UIViewController?
    var view: UIView?

    func installGestureRecognizer(on view: UIView) {
        self.view = view
        gestureRecognizer = UIRotationGestureRecognizer(target: self, action: #selector(didRotate))
        view.addGestureRecognizer(gestureRecognizer!)
    }

    @IBAction func didRotate() {
        if gestureRecognizer!.rotation < -CGFloat.pi/2 {
            let storyboard = UIStoryboard(name: "Debug", bundle: Bundle(for: type(of: self)))
            debugger = storyboard.instantiateInitialViewController()
            if let window = view as? UIWindow {
                window.rootViewController!.present(debugger!, animated: true)
            } else {
                view!.window!.rootViewController!.present(debugger!, animated: true)
            }
        }
    }
}

import UIKit

extension UIWindow {
    var currentViewController: UIViewController? {
        guard let root = self.rootViewController else {
            return nil
        }
        return UIWindow.findCurrentViewController(from: root)
    }

    static func findCurrentViewController(from: UIViewController) -> UIViewController {
        if let navVC = from as? UINavigationController,
           let visible = navVC.visibleViewController {
            return self.findCurrentViewController(from: visible)
        } else if let presented = from.presentedViewController {
            return self.findCurrentViewController(from: presented)
        } else {
            return from
        }
    }
}

//  Copyright © 2018 Koninklijke Philips Nederland B.V. All rights reserved.

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(
        _ app: UIApplication, open url: URL,
        options: [UIApplication.OpenURLOptionsKey : Any] = [:]
    ) -> Bool {
        guard url.path.starts(with: "/telepath") else { return false }

        return TelepathHandler.shared.handle(url: url)
    }
}

//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import UIKit
import ReSwift

typealias LaunchOptions = [UIApplicationLaunchOptionsKey: Any]?

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var storePersister: StorePersister?

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: LaunchOptions = nil) -> Bool {
        do {
            let documentsDirectory = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
            let url = URL(fileURLWithPath: documentsDirectory).appendingPathComponent("state.json")
            storePersister = try StorePersister(store: appStore, persistAt: url)
        } catch let e {
            print("Failed to create store persister; bailing out. Error: \(e)")
            abort()
        }
        if appStore.state.keyStore.keyStore == nil {
            appStore.dispatch(KeyStoreActions().create())
        }

        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        storePersister?.stop()
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        storePersister?.start()
    }
}

//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import UIKit
import ReSwift
import Geth

typealias LaunchOptions = [UIApplicationLaunchOptionsKey: Any]?

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var storePersister: StorePersister?

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: LaunchOptions = nil) -> Bool {
        storePersister = StorePersister.default
        if storePersister == nil {
            abort()
        }

        if appStore.state.keyStore.keyStore == nil {
            appStore.dispatch(KeyStoreActions.create())
            do {
                try appStore.state.keyStore.keyStore!.wrapped!.newAccount("test")
            } catch let e {
                print(e)
                abort()
            }
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

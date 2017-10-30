//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import ReSwift
import Geth
import Branch

typealias LaunchOptions = [UIApplicationLaunchOptionsKey: Any]?

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var storePersister: StorePersister?
    var telepathReceiver: TelepathReceiver?
    var geth: Geth?
    var syncProgressReporter: SyncProgressReporter!
    var peerReporter: PeerReporter!
    var debugGestureHandler: DebugGestureHandler!

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: LaunchOptions = nil) -> Bool {
        storePersister = StorePersister.default
        if storePersister == nil {
            abort()
        }

        telepathReceiver = TelepathReceiver(store: appStore)

        if appStore.state.keyStore.keyStore == nil {
            appStore.dispatch(KeyStoreActions.Create())
        }

//        startGeth()
        debugGestureHandler = DebugGestureHandler()
        debugGestureHandler.installGestureRecognizer(on: window!)

        startBranchSession(launchOptions: launchOptions)

        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        telepathReceiver?.stop()
        storePersister?.stop()
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        storePersister?.start()
        telepathReceiver?.start()
    }

    func startGeth() {
        geth = Geth()
        do {
            try geth!.node.start()

            peerReporter = PeerReporter(node: geth!.node, pollInterval: 1)
            peerReporter.onPeerCountAvailable = { count in
                appStore.dispatch(PeersUpdated(count: count))
            }
            peerReporter.start()

            let ethereumClient = try geth!.node.ethereumClient()
            syncProgressReporter = SyncProgressReporter(ethereumClient: ethereumClient, pollInterval: 1)
            syncProgressReporter.onSyncProgressAvailable = { progress in
                appStore.dispatch(SyncProgressUpdated(progress: progress))
            }
            syncProgressReporter.start()
        } catch let e {
            print(e)
            abort()
        }
    }

    func startBranchSession(launchOptions: LaunchOptions) {
        guard let branch = Branch.getInstance() else {
            print("could not get Branch instance")
            abort()
        }
        branch.initSession(launchOptions: launchOptions, andRegisterDeepLinkHandler: {params, error in
            if error == nil {
                guard let params = params as? [String: AnyObject] else {
                    return
                }
                print("params:", params)
                if let action = LaunchActions.create(forBranchParams: params) {
                    appStore.dispatch(action)
                }
            }
        })
    }

    func application(_ application: UIApplication, open url: URL, sourceApplication: String?, annotation: Any) -> Bool {
        // pass the url to the handle deep link call
        let branchHandled = Branch.getInstance().application(application,
                                                             open: url,
                                                             sourceApplication: sourceApplication,
                                                             annotation: annotation
        )
        if !branchHandled {
            // If not handled by Branch, do other deep link routing for the Facebook SDK, Pinterest SDK, etc
        }

        // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
        return true
    }

    // Respond to Universal Links
    func application(_ application: UIApplication,
                     continue userActivity: NSUserActivity,
                     restorationHandler: @escaping ([Any]?) -> Void) -> Bool {
        // pass the url to the handle deep link call
        Branch.getInstance().continue(userActivity)

        return true
    }
}

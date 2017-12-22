//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import ReSwift
import Geth

typealias LaunchOptions = [UIApplicationLaunchOptionsKey: Any]?

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var storePersister: StorePersister?
    var telepathReceiver: TelepathReceiver?
    var accountService: AccountService?
    var attestationService: AttestationService?
    var transactionSigningService: TransactionSigningService?
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
        accountService = AccountService(store: appStore)
        attestationService = AttestationService(store: appStore)
        transactionSigningService = TransactionSigningService(store: appStore)

        if appStore.state.keyStore.keyStore == nil {
            appStore.dispatch(KeyStoreActions.Create())
        }

//        startGeth()
        debugGestureHandler = DebugGestureHandler()
        debugGestureHandler.installGestureRecognizer(on: window!)

        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        telepathReceiver?.stop()
        storePersister?.stop()
        accountService?.stop()
        attestationService?.stop()
        transactionSigningService?.stop()
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        storePersister?.start()
        telepathReceiver?.start()
        accountService?.start()
        attestationService?.start()
        transactionSigningService?.start()
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

    func application(_ application: UIApplication,
                     continue userActivity: NSUserActivity,
                     restorationHandler: @escaping ([Any]?) -> Void) -> Bool {
        if userActivity.activityType == NSUserActivityTypeBrowsingWeb,
            let url = userActivity.webpageURL,
            let action = LaunchActions.create(forLink: url) {
            appStore.dispatch(action)
        }

        return true
    }
}

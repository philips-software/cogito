//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import ReSwift
import Geth

typealias LaunchOptions = [UIApplicationLaunchOptionsKey: Any]?

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var storePersister: StorePersister?
    var geth: Geth?
    var syncProgressReporter: SyncProgressReporter!
    var peerReporter: PeerReporter!

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

//        startGeth()

        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        storePersister?.stop()
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        storePersister?.start()
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
}

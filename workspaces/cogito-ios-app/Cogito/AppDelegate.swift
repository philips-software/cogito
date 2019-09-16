import UIKit
import ReSwift

typealias LaunchOptions = [UIApplication.LaunchOptionsKey: Any]?

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var storePersister: StorePersister?
    var telepathReceiver: TelepathReceiver?
    var telepathSubscriber: TelepathSubscriber?
    var debugGestureHandler: DebugGestureHandler!

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: LaunchOptions = nil) -> Bool {
        storePersister = StorePersister.default
        if storePersister == nil {
            abort()
        }

        telepathReceiver = TelepathReceiver(store: appStore)
        telepathSubscriber = TelepathSubscriber(store: appStore)
        telepathSubscriber?.addService(AccountService(store: appStore))
        telepathSubscriber?.addService(AttestationService(store: appStore))
        telepathSubscriber?.addService(TransactionSigningService(store: appStore))
        telepathSubscriber?.addService(EncryptionService(store: appStore))
        telepathSubscriber?.addService(IdentityInfoService(store: appStore))
        telepathSubscriber?.addService(ValueStoreService(store: appStore))

        if appStore.state.keyStore.keyStore == nil {
            appStore.dispatch(KeyStoreActions.Create())
        }

        debugGestureHandler = DebugGestureHandler()
        debugGestureHandler.installGestureRecognizer(on: window!)

        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        telepathSubscriber?.stop()
        telepathReceiver?.stop()
        storePersister?.stop()
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        storePersister?.start()
        telepathReceiver?.start()
        telepathSubscriber?.start()
    }

    func application(_ application: UIApplication,
                     continue userActivity: NSUserActivity,
                     restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        if userActivity.activityType == NSUserActivityTypeBrowsingWeb,
            let url = userActivity.webpageURL,
            let action = LaunchActions.create(forLink: url) {
            appStore.dispatch(action)
        }

        return true
    }
}

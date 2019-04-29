import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
  ) -> Bool {
    let jsCodeLocation = RCTBundleURLProvider
      .sharedSettings()?
      .jsBundleURL(forBundleRoot: "index", fallbackResource: nil)
    ReactNativeNavigation.bootstrap(jsCodeLocation, launchOptions: launchOptions)
    return true
  }
}

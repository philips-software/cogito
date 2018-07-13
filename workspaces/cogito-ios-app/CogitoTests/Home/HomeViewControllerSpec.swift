import Quick
import Nimble
import ReSwift
import ReSwiftThunk
@testable import Cogito

class HomeViewControllerSpec: QuickSpec {
    override func spec() {
        var home: HomeViewController!
        var store: Store<AppState>!

        beforeEach {
            let reducer: Reducer<AppState> = { _, _ in return initialAppState }
            store = Store<AppState>(reducer: reducer, state: nil)
            home = self.instantiateViewController()
            home.connection.store = store
        }

        describe("connecting to a telepath url") {
            var recorder: DispatchRecorder<ThunkAction<AppState>>!

            beforeEach {
                recorder = DispatchRecorder<ThunkAction<AppState>>()
                store.dispatchFunction = recorder.dispatch
            }

            it("dispatches the connect action") {
                home.actions.handleScannedQRCode("http://valid.url")
                expect(recorder.count) == 1
            }

            it("does not dispatch when the URL is incorrect") {
                home.actions.handleScannedQRCode("invalid url")
                expect(recorder.count) == 0
            }
        }
    }

    func instantiateViewController() -> HomeViewController? {
        let bundle = Bundle(for: HomeViewController.self)
        let storyboard = UIStoryboard(name: "Home", bundle: bundle)
        let viewController = storyboard.instantiateViewController(withIdentifier: "Home")
        return viewController as? HomeViewController
    }
}

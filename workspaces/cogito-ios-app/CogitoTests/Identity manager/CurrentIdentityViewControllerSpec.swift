import Quick
import Nimble
import ReSwift
import ReSwiftThunk
@testable import Cogito

class CurrentIdentityViewControllerSpec: QuickSpec {
    override func spec() {
        var home: CurrentIdentityViewController!
        var store: Store<AppState>!

        beforeEach {
            let reducer: Reducer<AppState> = { _, _ in return initialAppState }
            store = Store<AppState>(reducer: reducer, state: nil)
            home = self.instantiateViewController()
            home.connection.store = store
        }

        describe("connecting to a telepath url") {
            var recorder: DispatchRecorder<Thunk<AppState>>!

            beforeEach {
                recorder = DispatchRecorder<Thunk<AppState>>()
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

    func instantiateViewController() -> CurrentIdentityViewController? {
        let bundle = Bundle(for: CurrentIdentityViewController.self)
        let storyboard = UIStoryboard(name: "IdentityManager", bundle: bundle)
        let viewController = storyboard.instantiateViewController(withIdentifier: "CurrentIdentity")
        return viewController as? CurrentIdentityViewController
    }
}

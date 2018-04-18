//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwift
import ReSwiftThunk

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
            let identity = Identity.example

            beforeEach {
                recorder = DispatchRecorder<ThunkAction<AppState>>()
                store.dispatchFunction = recorder.dispatch
            }

            it("dispatches the connect action") {
                home.actions.connectToTelepathChannel("http://valid.url", identity)
                expect(recorder.count) == 1
            }

            it("does not dispatch when the URL is incorrect") {
                home.actions.connectToTelepathChannel("invalid url", identity)
                expect(recorder.count) == 0
            }
        }
    }

    func instantiateViewController() -> HomeViewController? {
        let bundle = Bundle(for: type(of: self))
        let storyboard = UIStoryboard(name: "Home", bundle: bundle)
        let viewController = storyboard.instantiateViewController(withIdentifier: "Home")
        return viewController as? HomeViewController
    }
}

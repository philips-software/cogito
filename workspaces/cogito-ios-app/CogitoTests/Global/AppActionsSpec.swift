import Quick
import Nimble
import ReSwift
@testable import ReSwiftThunk
@testable import Cogito

class AppActionsSpec: QuickSpec {
    override func spec() {
        context("when resetting") {
            var resetAppAction: Thunk<AppState>!

            beforeEach {
                resetAppAction = ResetApp()
            }

            it("resets existing key store") {
                let dispatchRecorder = DispatchRecorder<ResetAppState>()
                let keyStoreMock = KeyStoreMock(name: "some path", scryptN: 0, scryptP: 0)
                let getState = { return appState(keyStore: KeyStoreState(keyStore: keyStoreMock)) }
                resetAppAction.body(dispatchRecorder.dispatch, getState)
                expect(keyStoreMock.resetCalled).to(beTrue())
            }

            it("dispatches ResetAppState") {
                let dispatchRecorder = DispatchRecorder<ResetAppState>()
                resetAppAction.body(dispatchRecorder.dispatch, { return nil })
                expect(dispatchRecorder.count) == 1
            }

            it("creates new key store") {
                let dispatchRecorder1 = DispatchRecorder<Thunk<AppState>>()
                let dispatchRecorder2 = DispatchRecorder<KeyStoreActions.Fulfilled>()
                resetAppAction.body(dispatchRecorder1.dispatch, { return nil })
                dispatchRecorder1.actions[0].body(dispatchRecorder2.dispatch, { return nil })
                expect(dispatchRecorder2.count) == 1
            }
        }
    }
}

private class KeyStoreMock: KeyStore {
    var resetCalled = false
    override func reset() throws {
        resetCalled = true
    }
}

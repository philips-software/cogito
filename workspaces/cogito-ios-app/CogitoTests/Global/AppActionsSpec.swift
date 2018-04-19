//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwift
import ReSwiftThunk
@testable import Cogito

class AppActionsSpec: QuickSpec {
    override func spec() {
        context("when resetting") {
            var resetAppAction: ThunkAction<AppState>!

            beforeEach {
                resetAppAction = ResetApp()
            }

            it("resets existing key store") {
                let dispatchRecorder = DispatchRecorder<ResetAppState>()
                let keyStoreMock = KeyStoreMock(name: "some path", scryptN: 0, scryptP: 0)
                let getState = { return appState(keyStore: KeyStoreState(keyStore: keyStoreMock)) }
                resetAppAction.action(dispatchRecorder.dispatch, getState)
                expect(keyStoreMock.resetCalled).to(beTrue())
            }

            it("dispatches ResetAppState") {
                let dispatchRecorder = DispatchRecorder<ResetAppState>()
                resetAppAction.action(dispatchRecorder.dispatch, { return nil })
                expect(dispatchRecorder.count) == 1
            }

            it("creates new key store") {
                let dispatchRecorder1 = DispatchRecorder<ThunkAction<AppState>>()
                let dispatchRecorder2 = DispatchRecorder<KeyStoreActions.Fulfilled>()
                resetAppAction.action(dispatchRecorder1.dispatch, { return nil })
                dispatchRecorder1.actions[0].action(dispatchRecorder2.dispatch, { return nil })
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

import Quick
import Nimble
import ReSwift
import ReSwiftThunk
import Geth
@testable import Cogito

class CreateIdentityActionsSpec: QuickSpec {
    override func spec() {
        var testState: AppState!
        let getState: () -> AppState? = { return testState }
        var createAction: ThunkAction<AppState>!

        beforeEach {
            createAction = CreateIdentityActions.CreateIdentity()
        }

        it("dispatches pending") {
            let dispatchChecker = DispatchRecorder<CreateIdentityActions.Pending>()
            createAction.action(dispatchChecker.dispatch, getState)
            expect(dispatchChecker.count) == 1
        }

        it("dispatches rejected when state doesn't have key store") {
            let dispatchChecker = DispatchRecorder<CreateIdentityActions.Rejected>()
            createAction.action(dispatchChecker.dispatch, getState)
            expect(dispatchChecker.count) == 1
        }

        context("given proper state") {
            var keyStore: KeyStoreMock!

            beforeEach {
                keyStore = KeyStoreMock(name: "", scryptN: 0, scryptP: 0)
                testState = appState(keyStore: KeyStoreState(keyStore: keyStore),
                                     createIdentity: CreateIdentityState(description: "desc",
                                                                         pending: true,
                                                                         newAddress: nil,
                                                                         error: nil))
            }

            it("calls newAccount on keystore from state") {
                createAction.action({ _ in }, getState)
                expect(keyStore.newAccountCallCount).toEventually(equal(1))
            }

            it("dispatches DiamondActions.CreateFacet") {
                let dispatchChecker = DispatchRecorder<DiamondActions.CreateFacet>()
                let account = GethAccount()!
                let address = Address(fromHex: account.getAddress()!.getHex())!
                keyStore.newAccountReturn = account
                createAction.action(dispatchChecker.dispatch, getState)
                expect(dispatchChecker.count).toEventually(equal(1))
                expect(dispatchChecker.actions[0].description).toEventually(equal("desc"))
                expect(dispatchChecker.actions[0].address).toEventually(equal(address))
            }

            it("dispatches fulfilled with new account address") {
                let dispatchChecker = DispatchRecorder<CreateIdentityActions.Fulfilled>()
                let account = GethAccount()!
                let address = Address(fromHex: account.getAddress()!.getHex())!
                keyStore.newAccountReturn = account
                createAction.action(dispatchChecker.dispatch, getState)
                expect(dispatchChecker.count).toEventually(equal(1))
                expect(dispatchChecker.actions[0].address).toEventually(equal(address))
            }

            it("dispatches rejected when new account fails") {
                let dispatchChecker = DispatchRecorder<CreateIdentityActions.Rejected>()
                createAction.action(dispatchChecker.dispatch, getState)
                expect(dispatchChecker.count).toEventually(equal(1))
            }
        }
    }
}

private class KeyStoreMock: KeyStore {
    var newAccountCallCount = 0
    var newAccountReturn: GethAccount?
    var newAccountError: String?

    override func newAccount(onComplete: @escaping (_ account: GethAccount?, _ error: String?) -> Void) {
        newAccountCallCount += 1
        DispatchQueue.global().async { [unowned self] in
            onComplete(self.newAccountReturn, self.newAccountError)
        }
    }
}

import Quick
import Nimble
import ReSwift
import ReSwiftThunk
@testable import Cogito

class KeyStoreActionsSpec: QuickSpec {
    override func spec() {
        context("when creating a key store") {
            var fulfilled: KeyStoreActions.Fulfilled!

            beforeEach {
                var dispatchedAction: Action?
                let dispatch: DispatchFunction = { (action) in
                    dispatchedAction = action
                }
                let action = KeyStoreActions.Create()
                action.action(dispatch, { return nil })
                fulfilled = dispatchedAction as? KeyStoreActions.Fulfilled
            }

            it("stores it in the document directory") {
                let documentDirectory = NSSearchPathForDirectoriesInDomains(.documentDirectory,
                                                                            .userDomainMask,
                                                                            true)[0]
                expect(fulfilled.keyStore.path) == documentDirectory + "/main.keystore"
            }

            it("uses the standard key derivation parameters") {
                expect(fulfilled.keyStore.scryptN) == 65536
                expect(fulfilled.keyStore.scryptP) == 1
            }
        }
    }
}

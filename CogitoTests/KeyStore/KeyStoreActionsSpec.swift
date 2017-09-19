//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
@testable import Cogito
import ReSwift
import ReSwiftThunk
import Geth

class KeyStoreActionsSpec: QuickSpec {
    override func spec() {
        it("creates a key store") {
            var dispatchedAction: Action?
            let dispatch: DispatchFunction = { (action) in
                dispatchedAction = action
            }
            let action = KeyStoreActions(KeyStoreMock.self).create()
            action.action(dispatch, { return nil })
            guard let fulfilled = dispatchedAction as? KeyStoreActions.Fulfilled,
                  let keyStoreMock = fulfilled.keyStore as? KeyStoreMock else {
                fail("incorrect type of \(dispatchedAction!)")
                return
            }
            let documentDirectory = NSSearchPathForDirectoriesInDomains(.documentDirectory,
                                                                        .userDomainMask,
                                                                        true)[0]
            expect(keyStoreMock.path) == documentDirectory
            expect(keyStoreMock.scryptN) == GethStandardScryptN
            expect(keyStoreMock.scryptP) == GethStandardScryptP
        }
    }
}

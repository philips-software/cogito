///Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwiftThunk
import SwiftyJSON

struct AccountActions {
    // swiftlint:disable identifier_name
    static func GetAccounts(requestId: JsonRpcId,
                            channel: TelepathChannel) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, getState in
            var accounts: [String] = []
            if let diamond = getState()?.diamond,
               let selectedFacet = diamond.selectedFacet() {
                   accounts.append("\(selectedFacet.address)")
            }
            dispatch(TelepathActions.Send(id: requestId, result: accounts))
        })
    }
}

///Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwiftThunk
import SwiftyJSON

struct AccountActions {
    // swiftlint:disable identifier_name
    static func GetAccounts(requestId: JsonRpcId) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, getState in
            var accounts: [Address] = []
            if let diamond = getState()?.diamond,
               let selectedFacet = diamond.selectedFacet() {
                   accounts.append(selectedFacet.address)
            }
            let response = AccountsResult(id: requestId, result: accounts)
            dispatch(TelepathActions.Send(message: response.json))
        })
    }
}

private struct AccountsResult {
    let id: JsonRpcId
    let result: [Address]

    var json: String {
        let accountStrings = result.map { account in "\(account)" }
        return JSON([
            "jsonrpc": "2.0",
            "result": accountStrings,
            "id": id.object
        ]).rawString()!
    }
}

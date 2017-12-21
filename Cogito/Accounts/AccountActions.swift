///Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwiftThunk

struct AccountActions {
    // swiftlint:disable identifier_name
    static func GetAccounts() -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, getState in
            var accounts: [Address] = []
            if let diamond = getState()?.diamond,
               let selectedFacet = diamond.selectedFacet() {
                   accounts.append(selectedFacet.address)
            }
            let message = AccountsResult(result: accounts).json
            dispatch(TelepathActions.Send(message: message))
        })
    }
}

private struct AccountsResult: Codable {
    let result: [Address]
}

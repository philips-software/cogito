///Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwiftThunk
import SwiftyJSON

struct AccountActions {
    // swiftlint:disable identifier_name
    static func GetAccounts(requestId: JsonRpcId,
                            channel: TelepathChannel) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, getState in
            var accounts: [String] = []
            if
                let state = getState(),
                let identityReference = state.telepath.channels[channel],
                let identity = state.diamond.facets[identityReference]
            {
                   accounts.append("\(identity.address)")
            }
            dispatch(TelepathActions.Send(id: requestId,
                                          result: accounts,
                                          on: channel))
        })
    }
}

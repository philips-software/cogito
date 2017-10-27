//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import ReSwift
import ReSwiftThunk

struct TelepathActions {
    // swiftlint:disable identifier_name
    static func Connect(url: URL) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, _ in
            do {
                let channel = try TelepathChannel(connectUrl: url)
                dispatch(ConnectFulfilled(channel: channel))
            } catch let error {
                dispatch(ConnectRejected(error: error))
            }
        })
    }

    struct ConnectFulfilled: Action {
        let channel: TelepathChannel
    }

    struct ConnectRejected: Action {
        let error: Error
    }

    struct ReceiveFulfilled: Action {
        let message: String
    }

    struct ReceiveRejected: Action {
        let error: Error
    }
}

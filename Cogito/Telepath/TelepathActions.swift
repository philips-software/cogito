//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import ReSwift
import ReSwiftThunk

let queuingServiceUrl = URL(string: "https://telepath.cogito.mobi")!

struct TelepathActions {
    // swiftlint:disable identifier_name
    static func Connect(url: URL) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, _ in
            do {
                let channel = try TelepathChannel(
                    queuingServiceUrl: queuingServiceUrl,
                    connectUrl: url
                )
                dispatch(Connected(channel: channel))
            } catch let error {
                dispatch(ConnectionFailed(error: error))
            }
        })
    }

    struct Connected: Action {
        let channel: TelepathChannel
    }

    struct ConnectionFailed: Action {
        let error: Error
    }
}

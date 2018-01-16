//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import ReSwift
import ReSwiftThunk
import SwiftyJSON

struct TelepathActions {
    // swiftlint:disable:next identifier_name
    static func Connect(url: URL) -> ThunkAction<AppState> {
        return ThunkAction { dispatch, _ in
            do {
                let channel = try TelepathChannel(connectUrl: url)
                dispatch(ConnectFulfilled(channel: channel))
            } catch let error {
                dispatch(ConnectRejected(error: error))
            }
        }
    }

    struct ConnectFulfilled: Action {
        let channel: TelepathChannel
    }

    struct ConnectRejected: Action {
        let error: Error
    }

    // swiftlint:disable:next identifier_name
    static func Receive() -> ThunkAction<AppState> {
        return ThunkAction { dispatch, getState in
            getState()?.telepath.channel?.receive { message, error in
                if let error = error {
                    dispatch(ReceiveRejected(error: error))
                } else if let message = message {
                    dispatch(ReceiveFulfilled(message: message))
                }
            }
        }
    }

    struct ReceiveFulfilled: Action {
        let message: String
    }

    struct ReceiveRejected: Action {
        let error: Error
    }

    struct ReceivedMessageHandled: Action {}

    // swiftlint:disable:next identifier_name
    static func Send(message: String) -> ThunkAction<AppState> {
        return ThunkAction { dispatch, getState in
            dispatch(SendPending(message: message))
            getState()?.telepath.channel?.send(message: message) { error in
                if let error = error {
                    dispatch(SendRejected(error: error))
                } else {
                    dispatch(SendFulfilled())
                }
            }
        }
    }

    // swiftlint:disable:next identifier_name
    static func Send(id: JsonRpcId, result: String) -> ThunkAction<AppState> {
        return ThunkAction { dispatch, _ in
            let response = JSON([
                "jsonrpc": "2.0",
                "id": id.object,
                "result": JSON(result).object
                ])
            dispatch(Send(message: response.rawString()!))
        }
    }

    // swiftlint:disable:next identifier_name
    static func Send(id: JsonRpcId, result: [String:Any]) -> ThunkAction<AppState> {
        return ThunkAction { dispatch, _ in
            let response = JSON([
                "jsonrpc": "2.0",
                "id": id.object,
                "result": JSON(result).object
            ])
            dispatch(Send(message: response.rawString()!))
        }
    }

    // swiftlint:disable:next identifier_name
    static func Send(id: JsonRpcId, result: [Any]) -> ThunkAction<AppState> {
        return ThunkAction { dispatch, _ in
            let response = JSON([
                "jsonrpc": "2.0",
                "id": id.object,
                "result": JSON(result).object
            ])
            dispatch(Send(message: response.rawString()!))
        }
    }

    // swiftlint:disable:next identifier_name
    static func Send(id: JsonRpcId, errorCode: Int, errorMessage: String) -> ThunkAction<AppState> {
        return ThunkAction { dispatch, _ in
            let response = JSON([
                "jsonrpc": "2.0",
                "id": id.object,
                "error": [
                    "code": errorCode,
                    "message": errorMessage
                ]
            ])
            dispatch(Send(message: response.rawString()!))
        }
    }

    struct SendPending: Action {
        let message: String
    }

    struct SendFulfilled: Action {
    }

    struct SendRejected: Action {
        let error: Error
    }
}

import Foundation
import ReSwift
import ReSwiftThunk
import SwiftyJSON

struct TelepathActions {
    // swiftlint:disable:next identifier_name
    static func Connect(url: URL, for identity: Identity) -> Thunk<AppState> {
        return Thunk { dispatch, _ in
            do {
                let channel = try TelepathChannel(connectUrl: url)
                dispatch(Invalidate())
                dispatch(ConnectFulfilled(channel: channel, identity: identity))
                dispatch(Notify(message: "sendDidConnectNotification", on: channel))
                AudioFeedback.default.playIdentitySelected()
            } catch let error {
                dispatch(ConnectRejected(error: error, identity: identity))
            }
        }
    }

    struct ConnectFulfilled: Action {
        let channel: TelepathChannel
        let identity: Identity
    }

    struct ConnectRejected: Action {
        let error: Error
        let identity: Identity
    }

    // swiftlint:disable:next identifier_name
    static func Invalidate() -> Thunk<AppState> {
        return Thunk { _, getState in
            guard let channels = getState()?.telepath.channels else { return }
            for channel in channels.keys {
                channel.invalidate()
            }
        }
    }

    // swiftlint:disable:next identifier_name
    static func Receive() -> Thunk<AppState> {
        return Thunk { dispatch, getState in
            guard let channels = getState()?.telepath.channels else { return }
            for channel in channels.keys {
                channel.receive { message, error in
                    if let error = error {
                        dispatch(ReceiveRejected(error: error, channel: channel))
                    } else if let message = message {
                        dispatch(ReceiveFulfilled(message: message, channel: channel))
                    }
                }
            }
        }
    }

    struct ReceiveFulfilled: Action {
        let message: String
        let channel: TelepathChannel
    }

    struct ReceiveRejected: Action {
        let error: Error
        let channel: TelepathChannel
    }

    struct ReceivedMessageHandled: Action {}

    // swiftlint:disable:next identifier_name
    static func Send(message: String, on channel: TelepathChannel) -> Thunk<AppState> {
        return Thunk { dispatch, _ in
            dispatch(SendPending(message: message))
            channel.send(message: message) { error in
                if let error = error {
                    dispatch(SendRejected(error: error))
                } else {
                    dispatch(SendFulfilled())
                }
            }
        }
    }

    // swiftlint:disable:next identifier_name
    static func Send(id: JsonRpcId,
                     result: JSON,
                     on channel: TelepathChannel) -> Thunk<AppState> {
        return Thunk { dispatch, _ in
            let response = JSON([
                "jsonrpc": "2.0",
                "id": id.object,
                "result": result.object
                ])
            dispatch(Send(message: response.rawString()!, on: channel))
        }
    }

    // swiftlint:disable:next identifier_name
    static func Send(id: JsonRpcId,
                     result: String,
                     on channel: TelepathChannel) -> Thunk<AppState> {
        return Thunk { dispatch, _ in
            let response = JSON([
                "jsonrpc": "2.0",
                "id": id.object,
                "result": result
                ])
            dispatch(Send(message: response.rawString()!, on: channel))
        }
    }

    // swiftlint:disable:next identifier_name
    static func Send(id: JsonRpcId,
                     result: [String: Any],
                     on channel: TelepathChannel) -> Thunk<AppState> {
        return Thunk { dispatch, _ in
            let response = JSON([
                "jsonrpc": "2.0",
                "id": id.object,
                "result": JSON(result).object
            ])
            dispatch(Send(message: response.rawString()!, on: channel))
        }
    }

    // swiftlint:disable:next identifier_name
    static func Send(id: JsonRpcId,
                     result: [Any],
                     on channel: TelepathChannel) -> Thunk<AppState> {
        return Thunk { dispatch, _ in
            let response = JSON([
                "jsonrpc": "2.0",
                "id": id.object,
                "result": JSON(result).object
            ])
            dispatch(Send(message: response.rawString()!, on: channel))
        }
    }

    // swiftlint:disable:next identifier_name
    static func Send(id: JsonRpcId,
                     result: Data,
                     on channel: TelepathChannel) -> Thunk<AppState> {
        return Thunk { dispatch, _ in
            let response = JSON([
                "jsonrpc": "2.0",
                "id": id.object,
                "result": "0x" + result.hexEncodedString()
                ])
            dispatch(Send(message: response.rawString()!, on: channel))
        }
    }

    // swiftlint:disable:next identifier_name
    static func Send(id: JsonRpcId,
                     error: TelepathError,
                     on channel: TelepathChannel) -> Thunk<AppState> {
        return Thunk { dispatch, _ in
            let response = JSON([
                "jsonrpc": "2.0",
                "id": id.object,
                "error": [
                    "code": error.code,
                    "message": error.message
                ]
            ])
            dispatch(Send(message: response.rawString()!, on: channel))
        }
    }

    // swiftlint:disable:next identifier_name
    static func Notify(message: String,
                       on channel: TelepathChannel) -> Thunk<AppState> {
        return Thunk { _, _ in
            let notification = [
                "jsonrpc": "2.0",
                "method": "connectionSetupDone"
            ]
            channel.notify(message: JSON(notification).rawString()!)
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

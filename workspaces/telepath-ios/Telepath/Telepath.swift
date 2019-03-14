import Foundation
import SocketIO

public protocol NotificationHandler {
    func on(notification: String)
    func on(error: Error)
}

public enum NotificationError: Error, Equatable {
    case setupFailed
    case unknown(data: [Any])
    case serverError(message: String)

    public static func == (lhs: NotificationError, rhs: NotificationError) -> Bool {
        switch (lhs, rhs) {
        case (.setupFailed, .setupFailed): return true
        case (.serverError(let lhsMessage), .serverError(let rhsMessage)): return lhsMessage == rhsMessage
        default: return false
        }
    }
}

public typealias CompletionHandler = (Error?) -> Void

public struct Telepath {
    let queuing: QueuingService
    let socketIOService: SocketIOService

    public init(serviceUrl: URL) {
        queuing = QueuingServiceClient(url: serviceUrl)
        socketIOService = SocketIOServiceClient {
            let socketManager = SocketManager(socketURL: serviceUrl, config: [.log(true)])
            return socketManager.defaultSocket
        }
    }

    public func connect(channel: ChannelID, key: ChannelKey, appName: String,
                        notificationHandler: NotificationHandler? = nil) -> SecureChannel {
        return SecureChannel(
            queuing: queuing, socketIOService: socketIOService,
            notificationHandler: notificationHandler,
            id: channel, key: key, appName: appName)
    }

    public func connect(url: URL,
                        notificationHandler: NotificationHandler? = nil) throws -> SecureChannel {
        let (id, key, appName) = try UrlCodec().decode(url: url)
        return connect(channel: id, key: key, appName: appName,
                       notificationHandler: notificationHandler)
    }
}

public typealias ChannelID = String

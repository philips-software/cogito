import Foundation
import SocketIO

public typealias NotificationHandler = (String) -> Void
enum NotificationError: Error {
    case setupFailed
    case unknown(data: [Any])
}
public typealias ErrorHandler = (Error) -> Void
public typealias CompletionHandler = (Error?) -> Void

public struct Telepath {
    let queuing: QueuingService
    let socketIOService: SocketIOService
    let socketManager: SocketManager

    public init(serviceUrl: URL) {
        queuing = QueuingServiceClient(url: serviceUrl)
        socketManager = SocketManager(socketURL: serviceUrl, config: [.log(true)])
        let socket = socketManager.defaultSocket
        socketIOService = SocketIOServiceClient(socket: socket)
    }

    public func connect(channel: ChannelID, key: ChannelKey, appName: String,
                        onNotification: NotificationHandler? = nil,
                        onNotificationError: ErrorHandler? = nil,
                        completion: CompletionHandler? = nil) -> SecureChannel {
        return SecureChannel(
            queuing: queuing, socketIOService: socketIOService,
            onNotification: onNotification,
            onNotificationError: onNotificationError,
            id: channel, key: key, appName: appName,
            completion: completion)
    }

    public func connect(url: URL,
                        onNotification: NotificationHandler? = nil,
                        onNotificationError: ErrorHandler? = nil,
                        completion: CompletionHandler? = nil) throws -> SecureChannel {
        let (id, key, appName) = try UrlCodec().decode(url: url)
        return connect(channel: id, key: key, appName: appName,
                       onNotification: onNotification,
                       onNotificationError: onNotificationError,
                       completion: completion)
    }
}

public typealias ChannelID = String

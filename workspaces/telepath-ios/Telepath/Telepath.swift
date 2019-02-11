import Foundation
import SocketIO

public typealias NotificationHandler = (String) -> Void

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
                        onNotification: NotificationHandler? = nil) -> SecureChannel {
        return SecureChannel(
            queuing: queuing, socketIOService: socketIOService,
            onNotification: onNotification,
            id: channel, key: key, appName: appName)
    }

    public func connect(url: URL,
                        onNotification: NotificationHandler? = nil) throws -> SecureChannel {
        let (id, key, appName) = try UrlCodec().decode(url: url)
        return connect(channel: id, key: key, appName: appName, onNotification: onNotification)
    }
}

public typealias ChannelID = String

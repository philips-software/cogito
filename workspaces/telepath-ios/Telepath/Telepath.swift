import Foundation
import SocketIO

public typealias NotificationHandler = (String) -> Void

public struct Telepath {
    let queuing: QueuingService
    let socketIOService: SocketIOService

    public init(queuingServiceUrl: URL) {
        queuing = QueuingServiceClient(url: queuingServiceUrl)
        let socketManager = SocketManager(socketURL: queuingServiceUrl)
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

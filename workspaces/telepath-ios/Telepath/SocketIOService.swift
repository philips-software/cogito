public typealias EncryptedNotificationHandler = (Data) -> Void

public protocol SocketIOService {
    func start(channelID: ChannelID, onNotification: @escaping EncryptedNotificationHandler)
    func notify(data: Data)
}

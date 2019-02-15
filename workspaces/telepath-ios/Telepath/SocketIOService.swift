public typealias EncryptedNotificationHandler = (Data) -> Void

public protocol SocketIOService {
    func start(channelID: ChannelID,
               onNotification: @escaping EncryptedNotificationHandler,
               onError: ErrorHandler?,
               completion: ((Error?) -> Void)?)
    func notify(data: Data)
}

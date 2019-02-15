public typealias EncryptedNotificationHandler = (Data) -> Void

typealias ErrorHandler = (Error) -> Void

protocol SocketIOService {
    func start(channelID: ChannelID,
               onNotification: @escaping EncryptedNotificationHandler,
               onError: ErrorHandler?,
               completion: ((Error?) -> Void)?)
    func notify(data: Data)
}

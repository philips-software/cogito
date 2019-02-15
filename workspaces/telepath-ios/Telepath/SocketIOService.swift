public typealias EncryptedNotificationHandler = (Data) -> Void

typealias ErrorHandler = (Error) -> Void

protocol SocketIOService {
    func start(channelID: ChannelID,
               onNotification: @escaping EncryptedNotificationHandler,
               onError: ErrorHandler?,
               completion: CompletionHandler?)
    func notify(data: Data)
}

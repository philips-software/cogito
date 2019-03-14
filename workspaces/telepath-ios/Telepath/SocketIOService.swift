public typealias EncryptedNotificationHandler = (Data) -> Void

typealias ErrorHandler = (Error) -> Void

protocol SocketIOService {
    var started: Bool { get }
    func start(channelID: ChannelID,
               onNotification: @escaping EncryptedNotificationHandler,
               onError: ErrorHandler?,
               completion: CompletionHandler?)
    func notify(data: Data)
}

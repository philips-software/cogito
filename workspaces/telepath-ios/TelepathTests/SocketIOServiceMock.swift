@testable import Telepath

class SocketIOServiceMock: SocketIOService {
    var latestSentMessage: Data?
    var notificationHandler: EncryptedNotificationHandler?

    func start(channelID: ChannelID,
               onNotification: @escaping EncryptedNotificationHandler,
               onError: ErrorHandler?,
               completion: ((Error?) -> Void)?) {
        notificationHandler = onNotification
    }
    func notify(data: Data) {
        latestSentMessage = data
    }

    func fakeIncomingNotification(data: Data) {
        notificationHandler?(data)
    }
}

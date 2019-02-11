//  Copyright © 2019 Koninklijke Philips Nederland N.V. All rights reserved.

@testable import Telepath

class SocketIOServiceMock: SocketIOService {
    var latestSentMessage: Data?
    var notificationHandler: EncryptedNotificationHandler?

    func start(channelID: ChannelID, onNotification: @escaping EncryptedNotificationHandler) {
        notificationHandler = onNotification
    }
    func notify(data: Data) {
        latestSentMessage = data
    }

    func fakeIncomingNotification(data: Data) {
        notificationHandler?(data)
    }
}

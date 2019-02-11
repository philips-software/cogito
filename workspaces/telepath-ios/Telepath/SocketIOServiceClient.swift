//  Copyright © 2019 Koninklijke Philips Nederland N.V. All rights reserved.

import SocketIO
import base64url

class SocketIOServiceClient: SocketIOService {
    let socket: SocketIOClient
    var pendingNotifications = [String]()
    var setupComplete = false
    var channelID: ChannelID!
    var notificationHandler: EncryptedNotificationHandler!

    init(socket: SocketIOClient) {
        self.socket = socket
    }

    deinit {
        self.socket.removeAllHandlers()
        self.socket.disconnect()
    }

    func start(channelID: ChannelID, onNotification: @escaping EncryptedNotificationHandler) {
        self.channelID = channelID
        self.notificationHandler = onNotification
        socket.on(clientEvent: .connect) { [weak self] _, _ in self?.onConnect() }
        socket.on("notification") { [weak self] data, _ in self?.onNotification(data) }
//        socket.on(clientEvent: .error) { error, _ in print("error: ", error) }
        socket.connect()
    }

    func onConnect() {
        socket.emitWithAck("identify", channelID).timingOut(after: 30) { [weak self] items in
            if items.count > 0 && items[0] as? String == SocketAckStatus.noAck.rawValue {
                // todo handle timeout
            } else {
                self?.sendPendingNotifications()
            }
        }
    }

    func onNotification(_ data: [Any]) {
        if let encoded = data[0] as? Data,
            let base64 = String(data: encoded, encoding: .utf8),
            let message = Data(base64urlEncoded: base64) {
            self.notificationHandler(message)
        }
    }

    func sendPendingNotifications() {
        for message in pendingNotifications {
            socket.emit("notification", message)
        }
        pendingNotifications = []
        setupComplete = true
    }

    func notify(data: Data) {
        let encodedData = data.base64urlEncodedString()
        if setupComplete {
            socket.emit("notification", encodedData)
        } else {
            pendingNotifications.append(encodedData)
        }
    }
}

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
        // TODO handle errors
        // socket.on(clientEvent: .error) { error, _ in print("error: ", error) }
        socket.connect()
    }

    func onConnect() {
        DispatchQueue.main.async { [unowned self] in
            self.socket
                .emitWithAck("identify", self.channelID)
                .timingOut(after: 30) { [weak self] items in
                    if items.count > 0 && items[0] as? String == SocketAckStatus.noAck.rawValue {
                        // TODO handle timeout
                    } else {
                        self?.sendPendingNotifications()
                    }
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
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            for message in self.pendingNotifications {
                self.socket.emit("notification", message)
            }
            self.pendingNotifications = []
            self.setupComplete = true
        }
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

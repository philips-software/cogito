//  Copyright © 2019 Koninklijke Philips Nederland N.V. All rights reserved.

import SocketIO

class SocketIOServiceClient: SocketIOService {
    let socket: SocketIOClient

    init(socket: SocketIOClient) {
        self.socket = socket
    }

    deinit {
        self.socket.removeAllHandlers()
        self.socket.disconnect()
    }

    func start(onNotification: @escaping EncryptedNotificationHandler) {
        socket.on("notification") { data, _ in
            if let message = data[0] as? Data {
                onNotification(message)
            }
        }
        socket.connect()
    }

    func notify(data: Data) {
        guard socket.status == .connected else { return }
        let encodedData = data.base64EncodedString()
        socket.emit("notification", encodedData)
    }
}

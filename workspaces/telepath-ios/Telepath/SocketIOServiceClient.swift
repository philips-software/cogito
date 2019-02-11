//  Copyright © 2019 Koninklijke Philips Nederland N.V. All rights reserved.

import SocketIO
import base64url

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
            if let encoded = data[0] as? Data,
                let base64 = String(data: encoded, encoding: .utf8),
                let message = Data(base64urlEncoded: base64) {
                onNotification(message)
            }
        }
        socket.connect()
    }

    func notify(data: Data) {
        guard socket.status == .connected else { return }
        let encodedData = data.base64urlEncodedString()
        socket.emit("notification", encodedData)
    }
}

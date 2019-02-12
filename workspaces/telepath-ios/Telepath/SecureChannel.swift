import Sodium
import SocketIO

public struct SecureChannel {
    public let id: ChannelID
    public let appName: String

    var queuing: QueuingService
    let socketIOService: SocketIOService
    let key: ChannelKey
    let receivingQueue: QueueID
    let sendingQueue: QueueID
    let notificationHandler: NotificationHandler?

    init(queuing: QueuingService, socketIOService: SocketIOService,
         onNotification: NotificationHandler?,
         id: ChannelID, key: ChannelKey, appName: String) {
        self.queuing = queuing
        self.socketIOService = socketIOService
        self.notificationHandler = onNotification
        self.key = key
        self.id = id
        self.appName = appName
        self.receivingQueue = id + ".red"
        self.sendingQueue = id + ".blue"
        socketIOService.start(onNotification: onEncryptedNotification)
    }

    public mutating func invalidate() {
        queuing.invalidate()
    }

    public func send(message: String, completion: @escaping (Error?) -> Void) {
        let plainText = message.data(using: .utf8)!
        let cypherText = key.encrypt(plainText: plainText)
        queuing.send(queueId: sendingQueue, message: cypherText) { error in
            guard error == nil else {
                completion(Failure.sendingFailed(cause: error!))
                return
            }
            completion(nil)
        }
    }

    public func receive(completion: @escaping (String?, Error?) -> Void) {
        queuing.receive(queueId: receivingQueue) { data, error in
            guard error == nil else {
                completion(nil, Failure.receivingFailed(cause: error!))
                return
            }
            guard let cypherText = data else {
                completion(nil, nil)
                return
            }
            guard let plainText = try? self.key.decrypt(cypherText: cypherText) else {
                completion(nil, Failure.decryptionFailed)
                return
            }
            completion(String(data: plainText, encoding: .utf8), nil)
        }
    }

    public func notify(message: String) {
        let plainText = message.data(using: .utf8)!
        let cypherText = key.encrypt(plainText: plainText)
        socketIOService.notify(data: cypherText)
    }

    func onEncryptedNotification(data: Data) {
        guard let plainText = try? self.key.decrypt(cypherText: data),
              let message = String(data: plainText, encoding: .utf8) else {
            return
        }
        notificationHandler?(message)
    }

    enum Failure: Error {
        case sendingFailed (cause: Error)
        case receivingFailed (cause: Error)
        case decryptionFailed
    }
}

extension Array where Element == UInt8 {
    func encrypt(plainText: Data) -> Data {
        let box = Sodium().secretBox
        return Data(box.seal(message: [UInt8](plainText), secretKey: self)!)
    }

    func decrypt(cypherText: Data) throws -> Data {
        let box = Sodium().secretBox
        let opened = box.open(nonceAndAuthenticatedCipherText: [UInt8](cypherText), secretKey: self)
        guard let result = opened else {
            throw Errors.decryptionFailed
        }
        return Data(result)
    }

    enum Errors: Error {
        case decryptionFailed
    }
}

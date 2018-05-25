//Copyright © 2017 Philips. All rights reserved.

import Sodium

public struct SecureChannel {
    public let id: ChannelID
    public let appName: String

    var queuing: QueuingService
    let key: ChannelKey
    let receivingQueue: QueueID
    let sendingQueue: QueueID

    init(queuing: QueuingService, id: ChannelID, key: ChannelKey, appName: String) {
        self.queuing = queuing
        self.key = key
        self.id = id
        self.appName = appName
        self.receivingQueue = id + ".red"
        self.sendingQueue = id + ".blue"
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

    enum Failure: Error {
        case sendingFailed(cause: Error)
        case receivingFailed(cause: Error)
        case decryptionFailed
    }
}

extension ChannelKey {
    func encrypt(plainText: Data) -> Data {
        let box = Sodium().secretBox
        return box.seal(message: plainText, secretKey: self)!
    }

    func decrypt(cypherText: Data) throws -> Data {
        let box = Sodium().secretBox
        let opened = box.open(nonceAndAuthenticatedCipherText: cypherText, secretKey: self)
        guard let result = opened else {
            throw Errors.decryptionFailed
        }
        return result
    }

    enum Errors: Error {
        case decryptionFailed
    }
}

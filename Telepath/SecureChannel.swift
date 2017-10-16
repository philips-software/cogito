//Copyright © 2017 Philips. All rights reserved.

import Sodium

public struct SecureChannel {
    let queuing: QueuingService
    let key: ChannelKey
    let id: ChannelID
    let receivingQueue: QueueID
    let sendingQueue: QueueID

    init(queuing: QueuingService, id: ChannelID, key: ChannelKey) {
        self.queuing = queuing
        self.key = key
        self.id = id
        self.receivingQueue = id + ".red"
        self.sendingQueue = id + ".blue"
    }

    func send(message: String, completion: @escaping (Error?) -> Void) {
        let plainText = message.data(using: .utf8)!
        let cypherText = key.encrypt(plainText: plainText)
        queuing.send(queueId: sendingQueue, message: cypherText, completion: completion)
    }

    func receive() throws -> String? {
        guard let cypherText = try queuing.receive(queueId: receivingQueue) else {
            return nil
        }
        let plainText = try key.decrypt(cypherText: cypherText)
        return String(data: plainText, encoding: .utf8)
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

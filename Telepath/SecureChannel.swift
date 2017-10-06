//Copyright © 2017 Philips. All rights reserved.

import Sodium

public struct SecureChannel {
    let queuing: QueuingService
    let keys: ChannelKeys
    let id: ChannelID
    let receivingQueue: QueueID
    let sendingQueue: QueueID

    init(queuing: QueuingService, id: ChannelID, keys: ChannelKeys) {
        self.queuing = queuing
        self.keys = keys
        self.id = id
        self.receivingQueue = id + ".red"
        self.sendingQueue = id + ".blue"
    }

    func send(message: String) throws {
        let plainText = message.data(using: .utf8)!
        let cypherText = keys.encrypt(plainText: plainText)
        try queuing.send(queueId: sendingQueue, message: cypherText)
    }

    func receive() throws -> String? {
        guard let cypherText = try queuing.receive(queueId: receivingQueue) else {
            return nil
        }
        let plainText = try keys.decrypt(cypherText: cypherText)
        return String(data: plainText, encoding: .utf8)
    }
}

extension ChannelKeys {
    func encrypt(plainText: Data) -> Data {
        let box = Sodium().secretBox
        return box.seal(message: plainText, secretKey: encryptionKey)!
    }

    func decrypt(cypherText: Data) throws -> Data {
        let box = Sodium().secretBox
        let opened = box.open(nonceAndAuthenticatedCipherText: cypherText, secretKey: encryptionKey)
        guard let result = opened else {
            throw Errors.decryptionFailed
        }
        return result
    }

    enum Errors: Error {
        case decryptionFailed
    }
}

//Copyright © 2017 Philips. All rights reserved.

import RNCryptor

public struct SecureChannel {
    let queuing: QueuingService
    let keys: ChannelKeys
    let receivingQueue: QueueID
    let sendingQueue: QueueID

    init(queuing: QueuingService, id: ChannelID, keys: ChannelKeys) {
        self.queuing = queuing
        self.keys = keys
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
        let encryptor = RNCryptor.EncryptorV3(
            encryptionKey: encryptionKey,
            hmacKey: hmacKey
        )
        return encryptor.encrypt(data: plainText)
    }

    func decrypt(cypherText: Data) throws -> Data {
        let decryptor = RNCryptor.DecryptorV3(
            encryptionKey: encryptionKey,
            hmacKey: hmacKey
        )
        return try decryptor.decrypt(data: cypherText)
    }
}

extension SecureChannel: Equatable {
    public static func ==(lhs: SecureChannel, rhs: SecureChannel) -> Bool {
        return
            lhs.receivingQueue == rhs.receivingQueue &&
                lhs.sendingQueue == rhs.sendingQueue &&
                lhs.keys == rhs.keys
    }
}

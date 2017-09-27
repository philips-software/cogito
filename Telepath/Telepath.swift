//Copyright © 2017 Philips. All rights reserved.
import RNCryptor

public struct Telepath {
    let queue: QueuingService

    public func connect(channel: ChannelID, keys: ChannelKeys) -> SecureChannel {
        return SecureChannel(queue: queue, id: channel, keys: keys)
    }
}

public struct SecureChannel {
    let queue: QueuingService
    let keys: ChannelKeys
    let receivingQueue: QueueID
    let sendingQueue: QueueID

    init(queue: QueuingService, id: ChannelID, keys: ChannelKeys) {
        self.queue = queue
        self.keys = keys
        self.receivingQueue = id + ".red"
        self.sendingQueue = id + ".blue"
    }

    func send(message: String) throws {
        let plainText = message.data(using: .utf8)!
        let cypherText = keys.encrypt(plainText: plainText)
        try queue.send(queueId: sendingQueue, message: cypherText)
    }

    func receive() throws -> String? {
        guard let cypherText = try queue.receive(queueId: receivingQueue) else {
            return nil
        }
        let plainText = try keys.decrypt(cypherText: cypherText)
        return String(data: plainText, encoding: .utf8)
    }
}

public struct ChannelKeys {
    let encryptionKey: AES256Key
    let hmacKey: HMACKey
}

public typealias ChannelID = String
public typealias AES256Key = Data
public typealias HMACKey = Data

extension ChannelKeys {
    func encrypt(plainText: Data) -> Data {
        let encryptor = RNCryptor.EncryptorV3(encryptionKey: encryptionKey, hmacKey: hmacKey)
        return encryptor.encrypt(data: plainText)
    }

    func decrypt(cypherText: Data) throws -> Data {
        let decryptor = RNCryptor.DecryptorV3(encryptionKey: encryptionKey, hmacKey: hmacKey)
        return try decryptor.decrypt(data: cypherText)
    }
}

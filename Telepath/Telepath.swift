//Copyright © 2017 Philips. All rights reserved.
import RNCryptor

public struct Telepath {
    let queue: QueuingService

    public func openSecureChannel(id: ChannelID, keys: ChannelKeys) -> SecureChannel {
        return SecureChannel(queue: queue, id: id, keys: keys)
    }
}

public struct SecureChannel {
    let queue: QueuingService
    let id: QueueID
    let keys: ChannelKeys

    func send(message: String) throws {
        let plainText = message.data(using: .utf8)!
        let cypherText = keys.encrypt(plainText: plainText)
        try queue.send(queueId: id, message: cypherText)
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

//Copyright © 2017 Philips. All rights reserved.
import RNCryptor

public struct Telepath {
    let queue: QueuingService

    func openSecureChannel(id: UInt64, key: AES256Key) -> SecureChannel {
        return SecureChannel(queue: queue, id: id, key: key)
    }
}

public struct SecureChannel {
    let queue: QueuingService
    let id: UInt64
    let key: AES256Key

    func send(message: String) throws {
        let plainText = message.data(using: .utf8)!
        let cypherText = RNCryptor.encrypt(key: key, plainText: plainText)
        try queue.send(queueId: id, message: cypherText)
    }
}

public protocol QueuingService {
    func createQueue(id: UInt64) throws
    func send(queueId: UInt64, message: Data) throws
    func receive(queueId: UInt64) throws -> Data?
}

public typealias AES256Key = Data

extension RNCryptor {
    static func encrypt(key: Data, plainText: Data) -> Data {
        let encryptor = EncryptorV3(encryptionKey: key, hmacKey: key)
        return encryptor.encrypt(data: plainText)
    }

    static func decrypt(key: Data, cypherText: Data) -> Data? {
        let decryptor = DecryptorV3(encryptionKey: key, hmacKey: key)
        return try? decryptor.decrypt(data: cypherText)
    }
}

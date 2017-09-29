//Copyright © 2017 Philips. All rights reserved.
public struct ChannelKeys {
    let encryptionKey: AES256Key
    let hmacKey: HMACKey
}

public typealias AES256Key = Data
public typealias HMACKey = Data

extension ChannelKeys: Equatable {
    public static func ==(lhs: ChannelKeys, rhs: ChannelKeys) -> Bool {
        return
            lhs.encryptionKey == rhs.encryptionKey &&
                lhs.hmacKey == rhs.hmacKey
    }
}

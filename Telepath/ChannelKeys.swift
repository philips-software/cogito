//Copyright © 2017 Philips. All rights reserved.
import Sodium

public struct ChannelKeys {
    let encryptionKey: SecretBox.Key

    public init(encryptionKey: SecretBox.Key) {
        self.encryptionKey = encryptionKey
    }
}

extension ChannelKeys: Equatable {
    public static func == (lhs: ChannelKeys, rhs: ChannelKeys) -> Bool {
        return lhs.encryptionKey == rhs.encryptionKey
    }
}

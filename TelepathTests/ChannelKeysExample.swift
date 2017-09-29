//Copyright © 2017 Philips. All rights reserved.

import Telepath
import RNCryptor

extension ChannelKeys {
    static func example() -> ChannelKeys {
        let encryptionKey = RNCryptor.randomData(ofLength: 32)
        let hmacKey = RNCryptor.randomData(ofLength: 32)
        return ChannelKeys(encryptionKey: encryptionKey, hmacKey: hmacKey)
    }
}

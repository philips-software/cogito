//Copyright © 2017 Philips. All rights reserved.

import Telepath
import Sodium

extension ChannelKeys {
    static func example() -> ChannelKeys {
        let encryptionKey = Sodium().secretBox.key()!
        return ChannelKeys(encryptionKey: encryptionKey)
    }
}

//Copyright © 2017 Philips. All rights reserved.

import Telepath
import Sodium

extension ChannelKey {
    static func example() -> ChannelKey {
        return Sodium().secretBox.key()!
    }
}

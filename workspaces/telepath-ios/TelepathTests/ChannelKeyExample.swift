import Telepath
import Sodium

extension ChannelKey {
    static func example() -> ChannelKey {
        return Sodium().secretBox.key()!
    }
}

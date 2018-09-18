import Telepath
import Sodium

extension Array where Element == UInt8 {
    static func example() -> ChannelKey {
        return Sodium().secretBox.key()
    }
}

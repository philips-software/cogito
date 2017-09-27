//Copyright © 2017 Philips. All rights reserved.

import SwiftBytes
import SwiftyBase64

struct UrlCodec {
    let scheme: String
    
    func encode(channelId: ChannelID, keys: ChannelKeys) -> URL {
        var result = "\(scheme)://telepath/connect#"
        result += "I=\(channelId.encodeForUrlFragment())&"
        result += "E=\(keys.encryptionKey.encodeForUrlFragment())&"
        result += "A=\(keys.hmacKey.encodeForUrlFragment())"
        return URL(string: result)!
    }
}

extension String {
    func encodeForUrlFragment() -> String {
        return self.addingPercentEncoding(
            withAllowedCharacters: .urlFragmentAllowed
        )!
    }
}

extension Data {
    func encodeForUrlFragment() -> String {
        return EncodeString(self.bytes, alphabet: .URLAndFilenameSafe)
    }
}

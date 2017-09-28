//Copyright © 2017 Philips. All rights reserved.

struct UrlCodec {
    let scheme: String
    
    func encode(channelId: ChannelID, keys: ChannelKeys) -> URL {
        var result = "\(scheme)://telepath/connect#"
        result += "I=\(channelId.encodeForUrlFragment())&"
        result += "E=\(keys.encryptionKey.base64urlEncodedString())&"
        result += "A=\(keys.hmacKey.base64urlEncodedString())"
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

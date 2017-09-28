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

    func decode(url: URL) throws -> (channelId: ChannelID, channelKeys: ChannelKeys) {
        try checkUrl(url)
        let fragment = try extractFragment(url: url)
        let parameters = parseUrlParameters(fragment)
        let channelId = try extractChannelId(parameters: parameters)
        let encryptionKey = try extractEncryptionKey(parameters: parameters)
        let hmacKey = try extractAuthenticationKey(parameters: parameters)
        return (channelId, ChannelKeys(encryptionKey: encryptionKey, hmacKey: hmacKey))
    }

    private func checkUrl(_ url: URL) throws {
        guard url.scheme == scheme else {
            throw DecodeError.invalidUrlScheme
        }
        guard url.host == "telepath" else {
            throw DecodeError.invalidHostname
        }
        guard url.path == "/connect" else {
            throw DecodeError.invalidPath
        }
    }

    private func extractFragment(url: URL) throws -> String {
        guard let fragment = url.fragment else {
            throw DecodeError.missingParameters
        }
        return fragment
    }

    private func extractChannelId(parameters: [String: String]) throws -> ChannelID {
        guard let channelId = parameters["I"] else {
            throw DecodeError.missingChannelId
        }
        return channelId
    }

    private func extractEncryptionKey(parameters: [String: String]) throws -> Data {
        guard let encodedKey = parameters["E"] else {
            throw DecodeError.missingEncryptionKey
        }
        guard let key = Data(base64urlEncoded: encodedKey) else {
            throw DecodeError.invalidEncryptionKey
        }
        return key
    }

    private func extractAuthenticationKey(parameters: [String: String]) throws -> Data {
        guard let encodedKey = parameters["A"] else {
            throw DecodeError.missingAuthenticationKey
        }
        guard let key = Data(base64urlEncoded: encodedKey) else {
            throw DecodeError.invalidAuthenticationKey
        }
        return key
    }

    enum DecodeError: Error {
        case missingParameters
        case missingChannelId
        case missingEncryptionKey
        case missingAuthenticationKey
        case invalidEncryptionKey
        case invalidAuthenticationKey
        case invalidUrlScheme
        case invalidHostname
        case invalidPath
    }
}

extension String {
    func encodeForUrlFragment() -> String {
        return self.addingPercentEncoding(
            withAllowedCharacters: .urlFragmentAllowed
        )!
    }
}

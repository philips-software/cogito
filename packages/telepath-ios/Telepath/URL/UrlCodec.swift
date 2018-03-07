//Copyright © 2017 Philips. All rights reserved.

struct UrlCodec {
    func encode(baseUrl: URL, channelId: ChannelID, key: ChannelKey) -> URL {
        var result = "telepath/connect#"
        result += "I=\(channelId.encodeForUrlFragment())&"
        result += "E=\(key.base64urlEncodedString())"
        return URL(string: result, relativeTo:baseUrl)!
    }

    func decode(url: URL) throws -> (channelId: ChannelID, channelKey: ChannelKey) {
        try checkUrl(url)
        let fragment = try extractFragment(url: url)
        let parameters = parseUrlParameters(fragment)
        let channelId = try extractChannelId(parameters: parameters)
        let encryptionKey = try extractEncryptionKey(parameters: parameters)
        return (channelId, encryptionKey)
    }

    private func checkUrl(_ url: URL) throws {
        guard url.pathComponents.suffix(2) == ["telepath", "connect"] else {
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

    enum DecodeError: Error {
        case missingParameters
        case missingChannelId
        case missingEncryptionKey
        case invalidEncryptionKey
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

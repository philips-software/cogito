struct UrlCodec {
    func encode(baseUrl: URL, channelId: ChannelID, key: ChannelKey, appName: String) -> URL {
        var result = "telepath/connect#"
        result += "I=\(channelId.encodeForUrlFragment())"
        result += "&E=\(Data(key).base64urlEncodedString())"
        result += "&A=\(Data(appName.utf8).base64EncodedString())"
        return URL(string: result, relativeTo: baseUrl)!
    }

    func decode(url: URL) throws -> (channelId: ChannelID, channelKey: ChannelKey, appName: String) {
        try checkUrl(url)
        let fragment = try extractFragment(url: url)
        let parameters = parseUrlParameters(fragment)
        let channelId = try extractChannelId(parameters: parameters)
        let encryptionKey = try extractEncryptionKey(parameters: parameters)
        let appName = try extractAppName(parameters: parameters)
        return (channelId, [UInt8](encryptionKey), appName)
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

    private func extractAppName(parameters: [String: String]) throws -> String {
        guard let encodedAppName = parameters["A"] else {
            throw DecodeError.missingAppName
        }
        guard let appNameData = Data(base64urlEncoded: encodedAppName) else {
            throw DecodeError.invalidAppName
        }
        guard let appName = String(data: appNameData, encoding: .utf8) else {
            throw DecodeError.invalidAppName
        }
        return appName
    }

    enum DecodeError: Error {
        case missingParameters
        case missingChannelId
        case missingEncryptionKey
        case invalidEncryptionKey
        case missingAppName
        case invalidAppName
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

import ReSwift

struct LaunchActions {
    enum AppLinkType: String {
        case openIdConnectRedirect = "openid-callback"
        case attestationReceive = "receive"
        case telepathConnect = "connect"
    }

    static func create(forLink link: URL) -> Action? {
        let rawLinkType = link.lastPathComponent
        guard rawLinkType != "",
              let linkType = AppLinkType.init(rawValue: rawLinkType) else { return nil }
        switch linkType {
        case .openIdConnectRedirect:
            guard let fragment = link.fragment,
                  let params = parse(fragment: fragment) else {
                print("invalid URL: fragment missing or invalid")
                return nil
            }
            return OpenIDAttestationActions.Finish(params: params)
        case .attestationReceive:
            guard let fragment = link.fragment,
                let params = parse(fragment: fragment),
                params["A"] != nil else {
                    print("invalid URL: fragment missing or invalid")
                    return nil
            }
            return URLActions.HandleIncomingURL(url: link)
        case .telepathConnect:
            guard let fragment = link.fragment,
                let params = parse(fragment: fragment),
                params["I"] != nil, params["E"] != nil, params["A"] != nil else {
                    print("invalid URL: fragment missing or invalid")
                    return nil
            }
            return URLActions.HandleIncomingURL(url: link)
        }
    }

    static func parse(fragment: String) -> [String: String]? {
        var parsed: [String: String] = [:]
        for keyValuePair in fragment.split(separator: "&") {
            let split = keyValuePair.split(separator: "=")
            guard split.count == 2 else { return nil }
            parsed[String(split[0])] = String(split[1])
        }
        return parsed
    }
}

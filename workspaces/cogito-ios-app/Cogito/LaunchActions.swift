import ReSwift

struct LaunchActions {
    enum AppLinkType: String {
        case openIdConnectRedirect = "openid-callback"
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
        }
    }

    static func parse(fragment: String) -> [String:String]? {
        var parsed: [String:String] = [:]
        for keyValuePair in fragment.split(separator: "&") {
            let split = keyValuePair.split(separator: "=")
            guard split.count == 2 else { return nil }
            parsed[String(split[0])] = String(split[1])
        }
        return parsed
    }
}

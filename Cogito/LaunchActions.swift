//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct LaunchActions {
    static func create(forBranchParams params: [String: AnyObject]) -> Action? {
        if let referringLink = params["~referring_link"] as? String,
            let url = URL(string: referringLink) {
            return create(forLink: url)
        }

        return nil
    }

    enum AppLinkType: String {
        case openIdConnectRedirect = "bHwkY7KrvH"
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
            return AttestationActions.Finish(params: params)
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

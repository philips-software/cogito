//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

struct Attestation: Codable, Equatable {
    private let oidcTokenType = "oidcToken"

    let type: String
    let value: String
    var isOidcToken: Bool {
        return type == oidcTokenType
    }

    init(type: String, value: String) {
        self.type = type
        self.value = value
    }

    init(oidcToken: String) {
        self.type = oidcTokenType
        self.value = oidcToken
    }

    init?(string: String) {
        let split = string.split(separator: ":", maxSplits: 2)
        guard split.count == 2 else { return nil }

        self.type = String(split[0])
        self.value = String(split[1])
    }

}

extension Attestation: CustomStringConvertible {
    var description: String {
        return type + ":" + value
    }
}

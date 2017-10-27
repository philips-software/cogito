//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import Telepath

class TelepathChannel: Codable {
    let connectUrl: URL
    var channel: SecureChannel!

    required init(connectUrl: URL) throws {
        self.connectUrl = connectUrl
        try connect()
    }

    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        connectUrl = try container.decode(URL.self, forKey: .connectUrl)
        try connect()
    }

    func connect() throws {
        self.channel = try Telepath().connect(url: connectUrl)
    }

    enum CodingKeys: String, CodingKey {
        case connectUrl
    }
}

extension TelepathChannel: Equatable {
    static func == (lhs: TelepathChannel, rhs: TelepathChannel) -> Bool {
        return lhs.connectUrl == rhs.connectUrl
    }
}

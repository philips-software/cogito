//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import Telepath

class TelepathChannel: Codable {
    let queuingServiceUrl: URL
    let connectUrl: URL
    var channel: SecureChannel!

    required init(queuingServiceUrl: URL, connectUrl: URL) throws {
        self.queuingServiceUrl = queuingServiceUrl
        self.connectUrl = connectUrl
        try connect()
    }

    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        queuingServiceUrl = try container.decode(URL.self, forKey: .queuingServiceUrl)
        connectUrl = try container.decode(URL.self, forKey: .connectUrl)
        try connect()
    }

    func connect() throws {
        let telepath = Telepath(queuingServiceUrl: queuingServiceUrl.absoluteString)
        self.channel = try telepath.connect(url: connectUrl)
    }

    enum CodingKeys: String, CodingKey {
        case queuingServiceUrl
        case connectUrl
    }
}

extension TelepathChannel: Equatable {
    static func == (lhs: TelepathChannel, rhs: TelepathChannel) -> Bool {
        return lhs.queuingServiceUrl == rhs.queuingServiceUrl &&
            lhs.connectUrl == rhs.connectUrl
    }
}

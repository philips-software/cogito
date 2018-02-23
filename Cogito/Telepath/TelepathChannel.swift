//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import Telepath

protocol TelepathChannelType {
    func receive(completion: @escaping (String?, Error?) -> Void)
}

class TelepathChannel: TelepathChannelType, Codable {
    let connectUrl: URL
    var channel: SecureChannel!

    init(connectUrl: URL) throws {
        self.connectUrl = connectUrl
        try connect()
    }

    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        connectUrl = try container.decode(URL.self, forKey: .connectUrl)
        try connect()
    }

    private func connect() throws {
        self.channel = try Telepath().connect(url: connectUrl)
    }

    func receive(completion: @escaping (String?, Error?) -> Void) {
        self.channel.receive(completion: completion)
    }

    func send(message: String, completion: @escaping (Error?) -> Void) {
        self.channel.send(message: message, completion: completion)
    }

    var id: ChannelID { return channel.id }

    enum CodingKeys: String, CodingKey {
        case connectUrl
    }
}

extension TelepathChannel: Equatable {
    static func == (lhs: TelepathChannel, rhs: TelepathChannel) -> Bool {
        return lhs.connectUrl == rhs.connectUrl
    }
}

extension TelepathChannel: Hashable {
    var hashValue: Int {
        return self.channel.id.hashValue
    }
}

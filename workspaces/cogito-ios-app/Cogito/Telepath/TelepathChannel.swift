import Foundation
import Telepath

protocol TelepathChannelType {
    func receive(completion: @escaping (String?, Error?) -> Void)
}

class TelepathChannel: TelepathChannelType, Codable {
    let connectUrl: URL
    let telepath: Telepath = Telepath()
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

    func invalidate() {
        self.channel.invalidate()
    }

    private func connect() throws {
        self.channel = try telepath.connect(url: connectUrl)
        guard !connectUrl.absoluteString.contains("example") else { return }
        self.channel.startNotifications { error in
            if let error = error {
                print("Internal error: notifications are not working", error) // TODO how to handle this?
            }
        }
    }

    func receive(completion: @escaping (String?, Error?) -> Void) {
        self.channel.receive(completion: completion)
    }

    func send(message: String, completion: @escaping (Error?) -> Void) {
        self.channel.send(message: message, completion: completion)
    }

    func notify(message: String) {
        self.channel.notify(message: message)
    }

    var id: ChannelID { return channel.id }
    var appName: String { return channel.appName }

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

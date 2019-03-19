import Foundation
import Telepath

protocol TelepathChannelType {
    func receive(completion: @escaping (String?, Error?) -> Void)
}

class TelepathChannel: TelepathChannelType, Codable {
    static var createTelepathChannel: () -> Telepath = { return createTelepath() }

    let connectUrl: URL
    let telepath: Telepath
    private var actualChannel: SecureChannel?
    var channel: SecureChannel? {
        get {
            if actualChannel == nil {
                autoConnect()
            }
            return actualChannel
        }
        set { self.actualChannel = newValue }
    }

    init(connectUrl: URL,
         telepath: Telepath = TelepathChannel.createTelepathChannel()) {
        self.connectUrl = connectUrl
        self.telepath = telepath
    }

    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        connectUrl = try container.decode(URL.self, forKey: .connectUrl)
        telepath = TelepathChannel.createTelepathChannel()
    }

    func invalidate() {
        self.channel?.invalidate()
    }

    func connect(completion: CompletionHandler?) {
        do {
            self.channel = try telepath.connect(url: connectUrl)
        } catch let error {
            completion?(error)
            return
        }
        self.channel?.startNotifications { error in
            completion?(error)
        }
    }

    private func autoConnect() {
        connect(completion: nil)
    }

    func receive(completion: @escaping (String?, Error?) -> Void) {
        self.channel?.receive(completion: completion)
    }

    func send(message: String, completion: @escaping (Error?) -> Void) {
        self.channel?.send(message: message, completion: completion)
    }

    func notify(message: String) {
        self.channel?.notify(message: message)
    }

    var id: ChannelID? { return channel?.id }
    var appName: String? { return channel?.appName }

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
    func hash(into hasher: inout Hasher) {
        hasher.combine(self.channel?.id)
    }
}

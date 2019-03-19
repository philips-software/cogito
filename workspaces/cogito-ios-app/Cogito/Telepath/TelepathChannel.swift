import Foundation
import Telepath

protocol TelepathChannelType {
    func receive(completion: @escaping (String?, Error?) -> Void)
}

class TelepathChannel: TelepathChannelType, Codable {
    static var createTelepathChannel: () -> Telepath = { return createTelepath() }

    let connectUrl: URL
    let telepath: Telepath = TelepathChannel.createTelepathChannel()
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
    var disableNotifications = false

    init(connectUrl: URL) {
        self.connectUrl = connectUrl
    }

    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        connectUrl = try container.decode(URL.self, forKey: .connectUrl)
        disableNotifications = try container.decode(Bool.self, forKey: .disableNotifications)
    }

    func invalidate() {
        self.channel?.invalidate()
    }

    func connect(disableNotifications: Bool = false,
                 completion: CompletionHandler?) {
        self.disableNotifications = disableNotifications
        do {
            self.channel = try telepath.connect(url: connectUrl)
        } catch let error {
            completion?(error)
            return
        }
        if disableNotifications {
            completion?(nil)
            return
        }
        self.channel?.startNotifications { error in
            completion?(error)
        }
    }

    private func autoConnect() {
        connect(disableNotifications: self.disableNotifications, completion: nil)
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
        case disableNotifications
    }
}

extension TelepathChannel: Equatable {
    static func == (lhs: TelepathChannel, rhs: TelepathChannel) -> Bool {
        return lhs.connectUrl == rhs.connectUrl
            && lhs.disableNotifications == rhs.disableNotifications
    }
}

extension TelepathChannel: Hashable {
    func hash(into hasher: inout Hasher) {
        hasher.combine(self.channel?.id)
        hasher.combine(self.disableNotifications)
    }
}

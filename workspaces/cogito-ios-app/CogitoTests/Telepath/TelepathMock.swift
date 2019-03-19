import Telepath
@testable import Cogito

struct TelepathMock: Telepath {
    func connect(
        channel: ChannelID, key: ChannelKey, appName: String,
        notificationHandler: NotificationHandler?
    ) -> SecureChannel {
        return SecureChannelMock(id: channel, appName: appName)
    }
}

struct SecureChannelMock: SecureChannel {
    var id: ChannelID
    var appName: String

    func send(message: String, completion: @escaping (Error?) -> Void) {}
    func receive(completion: @escaping (String?, Error?) -> Void) {}

    func startNotifications(completion: CompletionHandler?) {
        DispatchQueue.main.async {
            completion?(nil)
        }
    }

    func notify(message: String) {}
    mutating func invalidate() {}
}

extension TelepathChannel {
    static var savedCreateFunction: (() -> Telepath)?

    static func startMocking() {
        assert(
            savedCreateFunction == nil,
            "You can start mocking only once (forgot to stopMocking?)")
        savedCreateFunction = TelepathChannel.telepathFactory
        TelepathChannel.telepathFactory = {
            return TelepathMock()
        }
    }

    static func stopMocking() {
        if let saved = savedCreateFunction {
            TelepathChannel.telepathFactory = saved
            savedCreateFunction = nil
        }
    }
}

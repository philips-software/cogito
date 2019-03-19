import Foundation
import Sodium

public func createTelepath(serviceUrl: URL) -> Telepath {
    return TelepathImpl(serviceUrl: serviceUrl)
}

public protocol Telepath {
    func connect(
        channel: ChannelID, key: ChannelKey, appName: String,
        notificationHandler: NotificationHandler?) -> SecureChannel

    func connect(
        url: URL,
        notificationHandler: NotificationHandler?) throws -> SecureChannel
}

extension Telepath {
    public func connect(
        url: URL,
        notificationHandler: NotificationHandler? = nil
    ) throws -> SecureChannel {
        let (id, key, appName) = try UrlCodec().decode(url: url)
        return connect(channel: id, key: key, appName: appName,
                       notificationHandler: notificationHandler)
    }
}

public protocol SecureChannel {
    var id: ChannelID { get }
    var appName: String { get }

    func send(message: String, completion: @escaping (Error?) -> Void)
    func receive(completion: @escaping (String?, Error?) -> Void)
    func startNotifications(completion: CompletionHandler?)
    func notify(message: String)
    mutating func invalidate()
}

public typealias ChannelID = String
public typealias ChannelKey = SecretBox.Key

public typealias CompletionHandler = (Error?) -> Void

public protocol NotificationHandler {
    func on(notification: String)
    func on(error: Error)
}

protocol Telepath {
    init(serviceUrl: URL)

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

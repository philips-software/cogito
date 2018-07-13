import Foundation

public struct Telepath {
    let queuing: QueuingService

    public init(queuingServiceUrl: URL) {
        queuing = QueuingServiceClient(url: queuingServiceUrl)
    }

    public func connect(channel: ChannelID, key: ChannelKey, appName: String) -> SecureChannel {
        return SecureChannel(queuing: queuing, id: channel, key: key, appName: appName)
    }

    public func connect(url: URL) throws -> SecureChannel {
        let (id, key, appName) = try UrlCodec().decode(url: url)
        return SecureChannel(queuing: queuing, id: id, key: key, appName: appName)
    }
}

public typealias ChannelID = String

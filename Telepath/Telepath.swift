//Copyright © 2017 Philips. All rights reserved.

public struct Telepath {
    let queuing: QueuingService

    public init(queuingServiceUrl: String) {
        queuing = QueuingServiceClient(url: queuingServiceUrl)
    }

    public func connect(channel: ChannelID, key: ChannelKey) -> SecureChannel {
        return SecureChannel(queuing: queuing, id: channel, key: key)
    }

    public func connect(url: URL) throws -> SecureChannel {
        let (id, key) = try UrlCodec().decode(url: url)
        return SecureChannel(queuing: queuing, id: id, key: key)
    }
}

public typealias ChannelID = String

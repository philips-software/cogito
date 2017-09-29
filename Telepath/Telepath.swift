//Copyright © 2017 Philips. All rights reserved.

public struct Telepath {
    let queuing: QueuingService

    public func connect(channel: ChannelID, keys: ChannelKeys) -> SecureChannel {
        return SecureChannel(queuing: queuing, id: channel, keys: keys)
    }

    public func connect(url: URL) throws -> SecureChannel {
        let (id, keys) = try UrlCodec().decode(url: url)
        return SecureChannel(queuing: queuing, id: id, keys: keys)
    }
}

public typealias ChannelID = String

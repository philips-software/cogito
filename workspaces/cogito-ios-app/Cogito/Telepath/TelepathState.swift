import Foundation
import Telepath

struct TelepathState: Equatable, Codable {
    var channels: [TelepathChannel: IdentityReference]
    var connectionError: String?
    var receivedMessages: [TelepathMessage] = []
    var receiveError: String?

    init(
        channels: [TelepathChannel: IdentityReference] = [:],
        connectionError: String? = nil,
        receivedMessages: [TelepathMessage] = [],
        receiveError: String? = nil
    ) {
        self.channels = channels
        self.connectionError = connectionError
        self.receivedMessages = receivedMessages
        self.receiveError = receiveError
    }

    func findChannel(id: ChannelID) -> TelepathChannel? {
        return channels.keys.first { $0.id == id }
    }

    static func == (lhs: TelepathState, rhs: TelepathState) -> Bool {
        return lhs.channels == rhs.channels
    }

    typealias IdentityReference = UUID
}

struct TelepathMessage: Codable {
    let message: String
    let channel: TelepathChannel
}

extension TelepathMessage: Equatable {
    static func == (lhs: TelepathMessage, rhs: TelepathMessage) -> Bool {
        return lhs.message == rhs.message &&
               lhs.channel == rhs.channel
    }
}

let initialTelepathState = TelepathState()

//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

struct TelepathState: Equatable, Codable {
    var channel: TelepathChannel?
    var connectionError: String?
    var receivedMessages: [String] = []
    var receiveError: String?

    init(
        channel: TelepathChannel? = nil,
        connectionError: String? = nil,
        receivedMessages: [String] = [],
        receiveError: String? = nil
    ) {
        self.channel = channel
        self.connectionError = connectionError
        self.receivedMessages = receivedMessages
        self.receiveError = receiveError
    }

    static func == (lhs: TelepathState, rhs: TelepathState) -> Bool {
        return lhs.channel == rhs.channel
    }
}

let initialTelepathState = TelepathState()

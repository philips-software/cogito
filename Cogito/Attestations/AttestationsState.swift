//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Telepath

typealias Nonce = String
typealias Subject = String

struct AttestationsState: Codable {
    var open: [Nonce: AttestationInProgress]
    var providedAttestations: [ChannelID: [String]]
}

extension AttestationsState: Equatable {
    static func == (lhs: AttestationsState, rhs: AttestationsState) -> Bool {
        return lhs.open == rhs.open
    }
}

struct AttestationInProgress: Codable {
    let nonce: Nonce
    let subject: Subject?
    let identity: Identity
    var status: Status
    var error: String?
    var idToken: String?
    let requestedOnChannel: ChannelID?

    enum Status: String, Codable {
        case pending
        case started
        case startRejected
        case finishRejected
        case fulfilled
    }
}

extension AttestationInProgress: Equatable {
    static func == (lhs: AttestationInProgress, rhs: AttestationInProgress) -> Bool {
        return lhs.nonce == rhs.nonce &&
               lhs.subject == rhs.subject &&
               lhs.identity == rhs.identity &&
               lhs.status == rhs.status &&
               lhs.requestedOnChannel == rhs.requestedOnChannel
    }
}

let initialAttestationsState = AttestationsState(open: [:], providedAttestations: [:])

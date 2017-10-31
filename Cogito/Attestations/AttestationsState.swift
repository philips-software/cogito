//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

typealias Nonce = String
typealias Subject = String

struct AttestationsState: Codable {
    var pending: [Nonce:PendingAttestation]
}

extension AttestationsState: Equatable {
    static func == (lhs: AttestationsState, rhs: AttestationsState) -> Bool {
        return lhs.pending == rhs.pending
    }
}

struct PendingAttestation: Codable {
    let nonce: Nonce
    let subject: Subject
    let identity: Identity
}

extension PendingAttestation: Equatable {
    static func == (lhs: PendingAttestation, rhs: PendingAttestation) -> Bool {
        return lhs.nonce == rhs.nonce && lhs.subject == rhs.subject && lhs.identity ==
                                                                       rhs.identity
    }
}

let initialAttestationsState = AttestationsState(pending: [:])

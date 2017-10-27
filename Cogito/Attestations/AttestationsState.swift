//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

typealias Nonce = String
typealias Subject = String

struct AttestationsState: Codable {
    var pending: [Nonce:Subject]
}

extension AttestationsState: Equatable {
    static func == (lhs: AttestationsState, rhs: AttestationsState) -> Bool {
        return lhs.pending == rhs.pending
    }

}

let initialAttestationsState = AttestationsState(pending: [:])

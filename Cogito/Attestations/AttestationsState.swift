//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

struct AttestationsState: Codable {
    let pendingNonces: [String]
}

extension AttestationsState: Equatable {
    static func == (lhs: AttestationsState, rhs: AttestationsState) -> Bool {
        return lhs.pendingNonces == rhs.pendingNonces
    }

}

let initialAttestationsState = AttestationsState(pendingNonces: [])

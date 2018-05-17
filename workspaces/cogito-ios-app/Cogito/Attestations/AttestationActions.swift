//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct AttestationActions {
    static func ReceiveAttestation(url: URL) -> Thunk { //swiftlint:disable:this identifier_name
        return Thunk { dispatch, _ in
            guard let attestation = parseAttestationUrl(url: url) else {
                return
            }

            dispatch(AttestationReceived(attestation: attestation))
        }
    }

    struct AttestationReceived: Action {
        let attestation: String
    }
}

private func parseAttestationUrl(url: URL) -> String? {
    if let value = url.fragment?.split(separator: "=").last {
        return String(value)
    } else {
        return nil
    }
}

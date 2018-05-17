//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct AttestationActions {
    static func ReceiveAttestation(url: URL) -> Thunk { //swiftlint:disable:this identifier_name
        return Thunk { dispatch, getState in
            guard let attestation = parseAttestationUrl(url: url) else {
                return
            }

            guard let identity = getState()?.diamond.selectedFacet() else {
                return
            }

            dispatch(DiamondActions.StoreAttestation(identity: identity, attestation: attestation))
        }
    }

    static func GetAttestations() -> Thunk { // swiftlint:disable:this identifier_name
        return Thunk { _, _ in

        }
    }
}

private func parseAttestationUrl(url: URL) -> String? {
    if let value = url.fragment?.split(separator: "=").last {
        return String(value)
    } else {
        return nil
    }
}

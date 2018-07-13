import ReSwift

struct AttestationActions {
    // swiftlint:disable:next identifier_name
    static func ReceiveAttestation(url: URL) -> Thunk {
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

    // swiftlint:disable:next identifier_name
    static func GetAttestations(type: String, requestId: JsonRpcId, channel: TelepathChannel) -> Thunk {
        return Thunk { dispatch, getState in
            let attestations = getState()?.diamond.selectedFacet()?.attestations
            let selectedAttestations = attestations?.filter { $0.hasPrefix(type) } ?? []
            dispatch(TelepathActions.Send(id: requestId, result: selectedAttestations, on: channel))
        }
    }
}

private func parseAttestationUrl(url: URL) -> String? {
    if let value = url.fragment?.split(separator: "=").last {
        return String(value).removingPercentEncoding
    } else {
        return nil
    }
}

import Foundation

struct URLActions {
    static func HandleIncomingURL(url: URL) -> Thunk { // swiftlint:disable:this identifier_name
        return Thunk { dispatch, getState in
            guard let identity = getState()?.diamond.selectedFacet() else {
                return
            }

            switch url.pathComponents.suffix(2) {
            case ["telepath", "connect"]:
                dispatch(TelepathActions.Connect(url: url, for: identity))
            case ["attestations", "receive"]:
                dispatch(AttestationActions.ReceiveAttestation(url: url))
            default:
                break
            }
        }
    }
}

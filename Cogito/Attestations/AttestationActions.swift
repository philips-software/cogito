//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import ReSwiftThunk
import JWTDecode

// swiftlint:disable identifier_name

struct AttestationActions {
    static func StartAttestation(for identity: Identity,
                                 oidcRealmUrl: URL,
                                 subject: String?) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, _ in
            let handler = OpenIDAttestationStarter(
                oidcRealmUrl: oidcRealmUrl,
                onSuccess: { nonce in dispatch(Started(nonce: nonce)) },
                onError: { nonce, error in dispatch(StartRejected(nonce: nonce, error: error)) })
            dispatch(Pending(identity: identity, nonce: handler.nonce, subject: subject))
            handler.run()
        })
    }

    static func Finish(params: [String:String]) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, getState in
            guard let idToken = params["id_token"] else {
                dispatch(FinishRejected(nonce: nil, error: "id token missing"))
                return
            }
            do {
                // todo this JWTDecode library does not check the JWT signature!
                let jwt = try JWTDecode.decode(jwt: idToken)
                guard let nonce = jwt.claim(name: "nonce").string else {
                    dispatch(FinishRejected(nonce: nil, error: "nonce is missing"))
                    return
                }
                guard let state = getState(),
                      let pendingAttestation = state.attestations.open[nonce],
                      (pendingAttestation.subject == nil || pendingAttestation.subject! == jwt.subject) else {
                    dispatch(FinishRejected(nonce: nonce, error: "unexpected nonce or subject"))
                    return
                }
                dispatch(DiamondActions.AddJWTAttestation(identity: pendingAttestation.identity,
                                                          idToken: idToken))
                dispatch(Fulfilled(nonce: nonce, idToken: idToken))
            } catch let e {
                dispatch(FinishRejected(nonce: nil, error: e.localizedDescription))
            }
        })
    }

    struct Pending: Action {
        let identity: Identity
        let nonce: String
        let subject: String?
    }

    struct Started: Action {
        let nonce: String
    }

    struct StartRejected: Action {
        let nonce: String
        let error: String
    }

    struct Fulfilled: Action {
        let nonce: String
        let idToken: String
    }

    struct FinishRejected: Action {
        let nonce: String?
        let error: String
    }

    static func GetAttestations(oidcRealmUrl: String) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, getState in
            if let facet = getState()?.diamond.selectedFacet(),
               let token = facet.findToken(claim: "iss", value: oidcRealmUrl) {
                let message = AttestationsResult(idToken: token).json
                dispatch(TelepathActions.Send(message: message))
            }
        })
    }
}

private struct AttestationsResult: Codable {
    let idToken: String
}

private extension Encodable {
    var json: String {
        let data = try? JSONEncoder().encode(self)
        return String(data: data!, encoding: .utf8)!
    }
}

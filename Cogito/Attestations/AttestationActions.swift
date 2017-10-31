//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import ReSwiftThunk
import JWTDecode

// swiftlint:disable identifier_name

struct AttestationActions {
    static func StartAttestation(for identity: Identity,
                                 oidcRealmUrl: URL,
                                 subject: String) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, _ in
            let handler = OpenIDAttestationStarter(
                oidcRealmUrl: oidcRealmUrl,
                onSuccess: { nonce in dispatch(Started(nonce: nonce)) },
                onError: { error in dispatch(StartRejected(error: error)) })
            dispatch(Pending(identity: identity, nonce: handler.nonce, subject: subject))
            handler.run()
        })
    }

    static func Finish(params: [String:String]) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, getState in
            if let idToken = params["id_token"] {
                do {
                    // todo this JWTDecode library does not check the JWT signature!
                    let jwt = try JWTDecode.decode(jwt: idToken)
                    if let nonce = jwt.claim(name: "nonce").string,
                        let state = getState(),
                        let subject = jwt.subject,
                        let pendingAttestation = state.attestations.open[nonce],
                        pendingAttestation.subject == subject {
                        dispatch(Fulfilled(idToken: idToken))
                    } else {
                        dispatch(FinishRejected(error: "unexpected nonce or subject"))
                    }
                } catch let e {
                    dispatch(FinishRejected(error: e.localizedDescription))
                }
            } else {
                dispatch(FinishRejected(error: "id token missing"))
            }
        })
    }

    struct Pending: Action {
        let identity: Identity
        let nonce: String
        let subject: String
    }

    struct Started: Action {
        let nonce: String
    }

    struct StartRejected: Action {
        let error: String
    }

    struct Fulfilled: Action {
        let idToken: String
    }

    struct FinishRejected: Action {
        let error: String
    }
}

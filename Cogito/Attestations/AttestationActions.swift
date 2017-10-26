//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import ReSwiftThunk
import JWTDecode

// swiftlint:disable identifier_name

struct AttestationActions {
    static func StartAttestation(oidcRealmUrl: URL) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, _ in
            let handler = OpenIDAttestationStarter(
                oidcRealmUrl: oidcRealmUrl,
                onSuccess: { dispatch(Started()) },
                onError: { error in dispatch(StartRejected(error: error)) })
            dispatch(Pending(nonce: handler.nonce))
            handler.run()
        })
    }

    static func Finish(params: [String:String]) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, _ in
            if let idToken = params["id_token"] {
                do {
                    let jwt = try JWTDecode.decode(jwt: idToken)
                    print(jwt)
                    print(jwt.claim(name: "nonce"))
                    dispatch(Fulfilled(idToken: idToken))
                } catch let e {
                    dispatch(FinishRejected(error: e.localizedDescription))
                }
            } else {
                dispatch(FinishRejected(error: "id token missing"))
            }
        })
    }

    struct Pending: Action {
        let nonce: String
    }

    struct Started: Action {}

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

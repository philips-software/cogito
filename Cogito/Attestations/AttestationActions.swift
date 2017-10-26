//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import ReSwiftThunk

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
                dispatch(Fulfilled(idToken: idToken))
            } else {
                dispatch(FinishRejected())
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

    }
}

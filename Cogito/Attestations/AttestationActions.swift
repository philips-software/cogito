//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import ReSwiftThunk

struct AttestationActions {
    func StartAttestation(oidcRealmUrl: URL) -> ThunkAction<AppState> { // swiftlint:disable:this identifier_name
        return ThunkAction(action: { dispatch, _ in
            let handler = OpenIDAttestationStarter(
                oidcRealmUrl: oidcRealmUrl,
                onSuccess: { dispatch(Started()) },
                onError: { error in dispatch(Rejected(error: error)) })
            dispatch(Pending(nonce: handler.nonce))
            handler.run()
        })
    }

    struct Pending: Action {
        let nonce: String
    }

    struct Started: Action {}

    struct Rejected: Action {
        let error: String
    }
}

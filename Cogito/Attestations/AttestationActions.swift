//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import ReSwiftThunk

struct AttestationActions {
    func StartAttestation(oidcRealmUrl: URL) -> ThunkAction<AppState> { // swiftlint:disable:this identifier_name
        return ThunkAction(action: { dispatch, _ in
            dispatch(Pending())
            let handler = OpenIDAttestationHandler(
                oidcRealmUrl: oidcRealmUrl,
                onSuccess: { token in dispatch(Fulfilled(token: token)) },
                onError: { error in dispatch(Rejected(error: error)) })
            handler.run()
        })
    }

    struct Pending: Action {}

    struct Fulfilled: Action {
        let token: JWT
    }

    struct Rejected: Action {
        let error: String
    }
}

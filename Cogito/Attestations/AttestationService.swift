//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct AttestationService: TelepathService {

    let store: Store<AppState>

    func onRequest(_ request: JsonRpcRequest) {
        if
            request.method == "attestations",
            let appName = request.params["app"].string,
            let realmUrl = request.params["realmUrl"].string
        {
            let subject = request.params["subject"].string
            let action = AttestationActions.GetAttestations(
                requestId: request.id,
                applicationName: appName,
                oidcRealmUrl: realmUrl,
                subject: subject
            )
            store.dispatch(action)
        }
    }
}

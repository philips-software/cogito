//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class AttestationService: JsonRpcService {

    init(store: Store<AppState>) {
        super.init(store: store, method: "attestations")
    }

    override func onRequest(_ request: JsonRpcRequest) {
        if
            let appName = request.params["app"].string,
            let realmUrl = request.params["realmUrl"].string
        {
            let subject = request.params["subject"].string
            let action = AttestationActions.GetAttestations(
                applicationName: appName,
                oidcRealmUrl: realmUrl,
                subject: subject
            )
            store.dispatch(action)
        }
    }
}

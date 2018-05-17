//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct AttestationService: TelepathService {

    let store: Store<AppState>

    func onRequest(_ request: JsonRpcRequest, on channel: TelepathChannel) {
        guard request.method == "attestations",
              let appName = request.params["app"].string,
              let realmUrl = request.params["realmUrl"].string else { return }

        let subject = request.params["subject"].string
        let action = OpenIDAttestationActions.GetAttestations(
            requestId: request.id,
            applicationName: appName,
            oidcRealmUrl: realmUrl,
            subject: subject,
            channel: channel
        )
        store.dispatch(action)
    }
}

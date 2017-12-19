//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class AttestationService: TelepathService {

    init(store: Store<AppState>) {
        super.init(store: store, method: "attestations")
    }

    override func onMessage(_ message: String) {
        if let request = try? JSONDecoder().decode(JSONRequest.self, from: message) {
            let appName = "<?>" // todo take from request
            let subject: String? = nil // todo take from request (if present)
            let realmUrl = request.realmUrl
            store.dispatch(AttestationActions.GetAttestations(applicationName: appName,
                                                              oidcRealmUrl: realmUrl,
                                                              subject: subject))
        }
    }
}

private struct JSONRequest: Codable {
    let method: String
    let realmUrl: String
}

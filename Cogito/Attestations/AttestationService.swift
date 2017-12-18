//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class AttestationService: TelepathService {

    init(store: Store<AppState>) {
        super.init(store: store, method: "attestations")
    }

    override func onMessage(_ message: String) {
        if let request = try? JSONDecoder().decode(JSONRequest.self, from: message) {
            store.dispatch(AttestationActions.GetAttestations(oidcRealmUrl: request.realmUrl))
        }
    }
}

private struct JSONRequest: Codable {
    let method: String
    let realmUrl: String
}

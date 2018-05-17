//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct AttestationService: TelepathService {

    let store: Store<AppState>

    func onRequest(_ request: JsonRpcRequest, on channel: TelepathChannel) {
        guard request.method == "attestations" else {
            return
        }

        switch extractRequestType(request: request) {
        case Optional.some("openid"):
            onOpenIdRequest(request, on: channel)
        case Optional.some(let type):
            onAttestationRequest(request, type: type, on: channel)
        default:
            break
        }
    }

    func onOpenIdRequest(_ request: JsonRpcRequest, on channel: TelepathChannel) {
        guard
              let appName = request.params["app"].string,
              let realmUrl = request.params["realmUrl"].string
        else {
            return

        }

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

    func onAttestationRequest(_ request: JsonRpcRequest, type: String, on channel: TelepathChannel) {
        store.dispatch(AttestationActions.GetAttestations(type: type, requestId: request.id, channel: channel))
    }
}

private func extractRequestType(request: JsonRpcRequest) -> String? {
    if request.params["type"].exists() {
        return request.params["type"].string
    }
    if request.params["realmUrl"].exists() {
        return "openid"
    }
    return nil
}

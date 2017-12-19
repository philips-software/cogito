//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct GetAttestationsThunk {
    let oidcRealmUrl: String
    let dispatch: DispatchFunction
    let getState: () -> AppState?

    func send(error: String) {
        let msg = AttestationsResult(error: error).json
        self.dispatch(TelepathActions.Send(message: msg))
    }

    func send(idToken: String) {
        let msg = AttestationsResult(idToken: idToken).json
        self.dispatch(TelepathActions.Send(message: msg))
    }

    func showRequestAccessDialog(idToken: String) {
        let alert = RequestedAlert(title: "Request for access",
                                   message: "Application <?> wants to access your credentials " +
                                            // todo:    ^^^^^  insert application name
                                            "from \(self.oidcRealmUrl)",
                                   actions: [
                                       AlertAction(title: "Deny", style: .cancel) { _ in
                                           self.send(error: "user denied access")
                                       },
                                       AlertAction(title: "Approve", style: .default) { _ in
                                           self.send(idToken: idToken)
                                       }
                                   ])
        self.dispatch(DialogPresenterActions.RequestAlert(requestedAlert: alert))
    }

    func showLoginRequiredDialog(for identity: Identity, realmUrl: URL, subject: String? = nil) {
        let alert = RequestedAlert(title: "Login required",
                                   message: "Application <?> requires you to login to " +
                                            // todo:    ^^^^^  insert application name
                                            "\(self.oidcRealmUrl)",
                                            // ^^^^^^^^^^^^ todo: use webfinger
                                   actions: [
                                       AlertAction(title: "Cancel", style: .cancel) { _ in
                                           self.send(error: "user cancelled login")
                                       },
                                       AlertAction(title: "Login", style: .default) { _ in
                                           self.startAttestation(for: identity,
                                                                 realmUrl: realmUrl,
                                                                 subject: subject)
                                       }
                                   ])
        self.dispatch(DialogPresenterActions.RequestAlert(requestedAlert: alert))
    }

    func startAttestation(for identity: Identity, realmUrl: URL, subject: String? = nil) {
        self.dispatch(AttestationActions.StartAttestation(for: identity,
                                                          oidcRealmUrl: realmUrl,
                                                          subject: subject))
    }

    func execute() {
        guard let realmUrl = URL(string: oidcRealmUrl) else {
            send(error: "invalid realm URL")
            return
        }
        guard let state = getState(),
              let facet = state.diamond.selectedFacet() else {
            // todo send not configured properly
            return
        }

        if let idToken = facet.findToken(claim: "iss", value: oidcRealmUrl) {
            if GetAttestationsThunk.alreadyProvided(idToken: idToken, state: state) {
                send(idToken: idToken)
            } else {
                showRequestAccessDialog(idToken: idToken)
            }
        } else {
            showLoginRequiredDialog(for: facet, realmUrl: realmUrl)
        }
    }

    private static func alreadyProvided(idToken: String, state: AppState) -> Bool {
        guard let channelId = state.telepath.channel?.id,
              let providedTokens = state.attestations.providedAttestations[channelId] else {
            return false
        }
        return providedTokens.contains { $0 == idToken }
    }
}

private struct AttestationsResult: Codable {
    let idToken: String?
    let error: String?

    init(idToken: String? = nil, error: String? = nil) {
        self.idToken = idToken
        self.error = error
    }
}

private extension Encodable {
    var json: String {
        let data = try? JSONEncoder().encode(self)
        return String(data: data!, encoding: .utf8)!
    }
}

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct GetAttestationsThunk {
    let oidcRealmUrl: URL
    let subject: String?
    let dispatch: DispatchFunction
    let state: AppState
    let facet: Identity

    init?(oidcRealmUrl: String,
          subject: String? = nil,
          dispatch: @escaping DispatchFunction,
          getState: @escaping () -> AppState?) {
        guard let url = URL(string: oidcRealmUrl) else {
            GetAttestationsThunk.send(error: "invalid realm URL", dispatch: dispatch)
            return nil
        }
        guard let state = getState(),
              let facet = state.diamond.selectedFacet() else {
            // todo send not configured properly
            return nil
        }
        self.oidcRealmUrl = url
        self.subject = subject
        self.dispatch = dispatch
        self.state = state
        self.facet = facet
    }

    func execute() {
        if let idToken = facet.findToken(claim: "iss", value: oidcRealmUrl.absoluteString) {
            if GetAttestationsThunk.alreadyProvided(idToken: idToken, state: state) {
                send(idToken: idToken)
            } else {
                showRequestAccessDialog(idToken: idToken)
            }
        } else {
            showLoginRequiredDialog()
        }
    }

    static func send(error: String, dispatch: DispatchFunction) {
        let msg = AttestationsResult(error: error).json
        dispatch(TelepathActions.Send(message: msg))
    }

    func send(error: String) {
        GetAttestationsThunk.send(error: error, dispatch: self.dispatch)
    }

    func send(idToken: String) {
        let msg = AttestationsResult(idToken: idToken).json
        self.dispatch(TelepathActions.Send(message: msg))
    }

    func showRequestAccessDialog(idToken: String) {
        let alert = RequestedAlert(title: "Request for access",
                                   message: "Application <?> wants to access your credentials " +
                                            // todo:    ^^^^^  insert application name
                                            "from \(self.oidcRealmUrl.absoluteString)",
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

    func showLoginRequiredDialog() {
        let alert = RequestedAlert(title: "Login required",
                                   message: "Application <?> requires you to login to " +
                                            // todo:    ^^^^^  insert application name
                                            "\(self.oidcRealmUrl.absoluteString)",
                                            // ^^^^^^^^^^^^ todo: use webfinger
                                   actions: [
                                       AlertAction(title: "Cancel", style: .cancel) { _ in
                                           self.send(error: "user cancelled login")
                                       },
                                       AlertAction(title: "Login", style: .default) { _ in
                                           self.startAttestation()
                                       }
                                   ])
        self.dispatch(DialogPresenterActions.RequestAlert(requestedAlert: alert))
    }

    func startAttestation() {
        self.dispatch(AttestationActions.StartAttestation(for: self.facet,
                                                          oidcRealmUrl: self.oidcRealmUrl,
                                                          subject: self.subject))
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

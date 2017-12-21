//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct GetAttestationsBuilder {
    let oidcRealmUrlString: String
    let applicationName: String
    let subject: String?
    let dispatch: DispatchFunction
    let getState: () -> AppState?

    func build() -> GetAttestations {
        guard let url = URL(string: oidcRealmUrlString) else {
            return GetAttestationsInvalid(error: "invalid realm URL", dispatch: dispatch)
        }
        guard let state = getState(),
              let facet = state.diamond.selectedFacet() else {
            return GetAttestationsInvalid(error: "invalid configuration", dispatch: dispatch)
        }
        return GetAttestationsValid(applicationName: applicationName,
                                    oidcRealmUrl: url,
                                    subject: subject,
                                    dispatch: dispatch,
                                    state: state,
                                    facet: facet)
    }
}

protocol GetAttestations {
    var dispatch: DispatchFunction { get }
    func execute()
}

extension GetAttestations {
    func send(error: String) {
        let msg = AttestationsResult(error: error).json
        dispatch(TelepathActions.Send(message: msg))
    }
}

struct GetAttestationsInvalid: GetAttestations {
    let error: String
    let dispatch: DispatchFunction

    func execute() {
        send(error: error)
    }
}

struct GetAttestationsValid: GetAttestations {
    let applicationName: String
    let oidcRealmUrl: URL
    let subject: String?
    let dispatch: DispatchFunction
    let state: AppState
    let facet: Identity

    init(applicationName: String,
         oidcRealmUrl: URL,
         subject: String?,
         dispatch: @escaping DispatchFunction,
         state: AppState,
         facet: Identity) {
        self.applicationName = applicationName
        self.oidcRealmUrl = oidcRealmUrl
        self.subject = subject
        self.dispatch = dispatch
        self.state = state
        self.facet = facet
    }

    func execute() {
        if let idToken = facet.findToken(claim: "iss", value: oidcRealmUrl.absoluteString) {
            if GetAttestationsValid.alreadyProvided(idToken: idToken, state: state) {
                send(idToken: idToken)
            } else {
                showRequestAccessDialog(idToken: idToken)
            }
        } else {
            showLoginRequiredDialog()
        }
    }

    static func send(idToken: String, dispatch: DispatchFunction, state: AppState) {
        precondition(state.telepath.channel != nil)
        let msg = AttestationsResult(idToken: idToken).json
        dispatch(TelepathActions.Send(message: msg))
        let channelId = state.telepath.channel!.id
        dispatch(AttestationActions.Provided(idToken: idToken, channel: channelId))
    }

    func send(idToken: String) {
        GetAttestationsValid.send(idToken: idToken, dispatch: dispatch, state: state)
    }

    func showRequestAccessDialog(idToken: String) {
        let alert = RequestedAlert(title: "Request for access",
                                   message: "Application \(applicationName) wants to access your credentials " +
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
                                   message: "Application \(applicationName) requires you to login to " +
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
        precondition(state.telepath.channel != nil)
        let channelId = state.telepath.channel!.id
        self.dispatch(AttestationActions.StartAttestation(for: self.facet,
                                                          oidcRealmUrl: self.oidcRealmUrl,
                                                          subject: self.subject,
                                                          requestedOnChannel: channelId))
    }

    private static func alreadyProvided(idToken: String, state: AppState) -> Bool {
        guard let channelId = state.telepath.channel?.id,
              let providedTokens = state.attestations.providedAttestations[channelId] else {
            return false
        }
        return providedTokens.contains { $0 == idToken }
    }
}

struct AttestationsResult: Codable {
    let idToken: String?
    let error: String?

    init(idToken: String? = nil, error: String? = nil) {
        self.idToken = idToken
        self.error = error
    }
}

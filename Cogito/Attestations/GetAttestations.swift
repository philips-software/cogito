//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct GetAttestationsBuilder {
    let requestId: JsonRpcId
    let oidcRealmUrlString: String
    let applicationName: String
    let subject: String?
    let dispatch: DispatchFunction
    let getState: () -> AppState?

    func build() -> GetAttestations {
        guard let url = URL(string: oidcRealmUrlString) else {
            return GetAttestationsInvalid(requestId: requestId, error: .invalidRealmUrl, dispatch: dispatch)
        }
        guard
            let state = getState(),
            let facet = state.diamond.selectedFacet()
        else {
            return GetAttestationsInvalid(
                requestId: requestId,
                error: .invalidConfiguration,
                dispatch: dispatch
            )
        }
        return GetAttestationsValid(
            requestId: requestId,
            applicationName: applicationName,
            oidcRealmUrl: url,
            subject: subject,
            dispatch: dispatch,
            state: state,
            facet: facet
        )
    }
}

protocol GetAttestations {
    var dispatch: DispatchFunction { get }
    func execute()
}

extension GetAttestations {
    func send(id: JsonRpcId, error: TelepathError) {
        dispatch(TelepathActions.Send(
            id: id,
            error: error
        ))
    }
}

struct GetAttestationsInvalid: GetAttestations {
    let requestId: JsonRpcId
    let error: AttestationError
    let dispatch: DispatchFunction

    func execute() {
        send(id: requestId, error: error)
    }
}

struct GetAttestationsValid: GetAttestations {
    let requestId: JsonRpcId
    let applicationName: String
    let oidcRealmUrl: URL
    let subject: String?
    let dispatch: DispatchFunction
    let state: AppState
    let facet: Identity

    init(requestId: JsonRpcId,
         applicationName: String,
         oidcRealmUrl: URL,
         subject: String?,
         dispatch: @escaping DispatchFunction,
         state: AppState,
         facet: Identity) {
        self.requestId = requestId
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
                send(requestId: requestId, idToken: idToken)
            } else {
                showRequestAccessDialog(idToken: idToken)
            }
        } else {
            showLoginRequiredDialog()
        }
    }

    static func send(requestId: JsonRpcId, idToken: String, dispatch: DispatchFunction, state: AppState) {
        precondition(state.telepath.channel != nil)
        dispatch(TelepathActions.Send(id: requestId, result: idToken))
        let channelId = state.telepath.channel!.id
        dispatch(AttestationActions.Provided(idToken: idToken, channel: channelId))
    }

    func send(requestId: JsonRpcId, idToken: String) {
        GetAttestationsValid.send(
            requestId: requestId,
            idToken: idToken,
            dispatch: dispatch,
            state: state
        )
    }

    func showRequestAccessDialog(idToken: String) {
        let requestId = self.requestId
        let alert = RequestedAlert(
            title: "Request for access",
            message: "Application \(applicationName) wants to access your credentials " +
                     "from \(self.oidcRealmUrl.absoluteString)",
            actions: [
                AlertAction(title: "Deny", style: .cancel) { _ in
                    self.send(id: requestId, error: AttestationError.userDeniedAccess)
                },
                AlertAction(title: "Approve", style: .default) { _ in
                    self.send(requestId: requestId, idToken: idToken)
                }
            ])
        self.dispatch(DialogPresenterActions.RequestAlert(requestedAlert: alert))
    }

    func showLoginRequiredDialog() {
        let requestId = self.requestId
        let alert = RequestedAlert(
            title: "Login required",
            message: "Application \(applicationName) requires you to login to " +
                     "\(self.oidcRealmUrl.absoluteString)",
            actions: [
                AlertAction(title: "Cancel", style: .cancel) { _ in
                    self.send(id: requestId, error: AttestationError.userCancelledLogin)
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
        self.dispatch(AttestationActions.StartAttestation(
            for: self.facet,
            requestId: requestId,
            oidcRealmUrl: self.oidcRealmUrl,
            subject: self.subject,
            requestedOnChannel: channelId
        ))
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
    let errorCode: Int?
    let errorMessage: String?

    init(idToken: String? = nil, errorCode: Int? = nil, errorMessage: String? = nil) {
        self.idToken = idToken
        self.errorCode = errorCode
        self.errorMessage = errorMessage
    }
}

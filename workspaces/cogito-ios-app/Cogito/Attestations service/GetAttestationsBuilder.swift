import ReSwift

struct GetAttestationsBuilder {
    let requestId: JsonRpcId
    let oidcRealmUrlString: String
    let applicationName: String
    let subject: String?
    let dispatch: DispatchFunction
    let getState: () -> AppState?
    let channel: TelepathChannel

    func build() -> GetAttestations {
        guard let url = URL(string: oidcRealmUrlString) else {
            return GetAttestationsInvalid(requestId: requestId,
                                          error: .invalidRealmUrl,
                                          dispatch: dispatch,
                                          channel: channel)
        }
        guard
            let state = getState(),
            let identityReference = state.telepath.channels[channel],
            let facet = state.diamond.facets[identityReference]
        else {
            return GetAttestationsInvalid(
                requestId: requestId,
                error: .invalidConfiguration,
                dispatch: dispatch,
                channel: channel
            )
        }
        return GetAttestationsValid(
            requestId: requestId,
            applicationName: applicationName,
            oidcRealmUrl: url,
            subject: subject,
            dispatch: dispatch,
            state: state,
            facet: facet,
            channel: channel
        )
    }
}

protocol GetAttestations {
    var dispatch: DispatchFunction { get }
    func execute()
}

extension GetAttestations {
    func send(id: JsonRpcId, error: TelepathError, on channel: TelepathChannel) {
        dispatch(TelepathActions.Send(
            id: id,
            error: error,
            on: channel
        ))
    }
}

struct GetAttestationsInvalid: GetAttestations {
    let requestId: JsonRpcId
    let error: AttestationError
    let dispatch: DispatchFunction
    let channel: TelepathChannel

    func execute() {
        send(id: requestId, error: error, on: channel)
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
    let channel: TelepathChannel

    init(requestId: JsonRpcId,
         applicationName: String,
         oidcRealmUrl: URL,
         subject: String?,
         dispatch: @escaping DispatchFunction,
         state: AppState,
         facet: Identity,
         channel: TelepathChannel) {
        self.requestId = requestId
        self.applicationName = applicationName
        self.oidcRealmUrl = oidcRealmUrl
        self.subject = subject
        self.dispatch = dispatch
        self.state = state
        self.facet = facet
        self.channel = channel
    }

    func execute() {
        if let idToken = facet.findOpenIDToken(claim: "iss", value: oidcRealmUrl.absoluteString) {
            if GetAttestationsValid.alreadyProvided(idToken: idToken, state: state, on: channel) {
                send(requestId: requestId, idToken: idToken, on: channel)
            } else {
                showRequestAccessDialog(idToken: idToken)
            }
        } else {
            showLoginRequiredDialog()
        }
    }

    static func send(requestId: JsonRpcId,
                     idToken: String,
                     dispatch: DispatchFunction,
                     state: AppState,
                     on channel: TelepathChannel) {
        dispatch(TelepathActions.Send(id: requestId, result: idToken, on: channel))
        guard let channelId = channel.id else {
            return
        }
        dispatch(OpenIDAttestationActions.Provided(idToken: idToken, channel: channelId))
    }

    func send(requestId: JsonRpcId, idToken: String, on channel: TelepathChannel) {
        GetAttestationsValid.send(
            requestId: requestId,
            idToken: idToken,
            dispatch: dispatch,
            state: state,
            on: channel
        )
    }

    func showRequestAccessDialog(idToken: String) {
        let requestId = self.requestId
        let alert = RequestedAlert(
            title: "Request for access",
            message: "Application \(applicationName) wants to access the credentials " +
                     "from \(self.oidcRealmUrl.absoluteString) for your identity:",
            actions: [
                AlertAction(title: "Deny", style: .cancel) { _ in
                    self.send(id: requestId,
                              error: AttestationError.userDeniedAccess,
                              on: self.channel)
                },
                AlertAction(title: "Approve", style: .default) { _ in
                    self.send(requestId: requestId, idToken: idToken, on: self.channel)
                }
            ],
            textFieldConfigurator: textFieldConfigurator(facet: facet))
        self.dispatch(DialogPresenterActions.RequestAlert(requestedAlert: alert))
    }

    func showLoginRequiredDialog() {
        let requestId = self.requestId
        let alert = RequestedAlert(
            title: "Login required",
            message: "Application \(applicationName) requires you to login to " +
                     "\(self.oidcRealmUrl.absoluteString) using your identity:",
            actions: [
                AlertAction(title: "Cancel", style: .cancel) { _ in
                    self.send(id: requestId,
                              error: AttestationError.userCancelledLogin,
                              on: self.channel)
                },
                AlertAction(title: "Login", style: .default) { _ in
                    self.startAttestation()
                }
            ],
            textFieldConfigurator: textFieldConfigurator(facet: facet))
        self.dispatch(DialogPresenterActions.RequestAlert(requestedAlert: alert))
    }

    func textFieldConfigurator(facet: Identity) -> ((UITextField) -> Void) {
        return { (textField: UITextField) in
            textField.isUserInteractionEnabled = false
            textField.font = boldTypewriter
            textField.text = facet.description
            textField.textAlignment = .center
        }
    }

    func startAttestation() {
        self.dispatch(OpenIDAttestationActions.StartAttestation(
            for: self.facet,
            requestId: requestId,
            oidcRealmUrl: self.oidcRealmUrl,
            subject: self.subject,
            requestedOnChannel: channel.id
        ))
    }

    private static func alreadyProvided(idToken: String,
                                        state: AppState,
                                        on channel: TelepathChannel) -> Bool {
        guard let channelId = channel.id,
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

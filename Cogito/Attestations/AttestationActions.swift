//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import ReSwiftThunk
import JWTDecode

// swiftlint:disable identifier_name

struct AttestationActions {
    static func StartAttestation(for identity: Identity,
                                 oidcRealmUrl: URL,
                                 subject: String?) -> ThunkAction<AppState> {
        return ThunkAction { dispatch, _ in
            let handler = OpenIDAttestationStarter(
                oidcRealmUrl: oidcRealmUrl,
                onSuccess: { nonce in dispatch(Started(nonce: nonce)) },
                onError: { nonce, error in dispatch(StartRejected(nonce: nonce, error: error)) })
            dispatch(Pending(identity: identity, nonce: handler.nonce, subject: subject))
            handler.run()
        }
    }

    static func Finish(params: [String:String]) -> ThunkAction<AppState> {
        return ThunkAction { dispatch, getState in
            guard let idToken = params["id_token"] else {
                dispatch(FinishRejected(nonce: nil, error: "id token missing"))
                return
            }
            do {
                // todo this JWTDecode library does not check the JWT signature!
                let jwt = try JWTDecode.decode(jwt: idToken)
                guard let nonce = jwt.claim(name: "nonce").string else {
                    dispatch(FinishRejected(nonce: nil, error: "nonce is missing"))
                    return
                }
                guard let state = getState(),
                      let pendingAttestation = state.attestations.open[nonce],
                      (pendingAttestation.subject == nil || pendingAttestation.subject! == jwt.subject) else {
                    dispatch(FinishRejected(nonce: nonce, error: "unexpected nonce or subject"))
                    return
                }
                dispatch(DiamondActions.AddJWTAttestation(identity: pendingAttestation.identity,
                                                          idToken: idToken))
                dispatch(Fulfilled(nonce: nonce, idToken: idToken))
            } catch let e {
                dispatch(FinishRejected(nonce: nil, error: e.localizedDescription))
            }
        }
    }

    struct Pending: Action {
        let identity: Identity
        let nonce: String
        let subject: String?
    }

    struct Started: Action {
        let nonce: String
    }

    struct StartRejected: Action {
        let nonce: String
        let error: String
    }

    struct Fulfilled: Action {
        let nonce: String
        let idToken: String
    }

    struct FinishRejected: Action {
        let nonce: String?
        let error: String
    }

    static func GetAttestations(oidcRealmUrl: String) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, getState in
            let sendIdToken = { (idToken: String) in
                let msg = AttestationsResult(idToken: idToken).json
                dispatch(TelepathActions.Send(message: msg))
            }
            let sendError = { (error: String) in
                let msg = AttestationsResult(error: error).json
                dispatch(TelepathActions.Send(message: msg))
            }
            let showRequestAccessDialog = { (idToken: String) in
                let alert = RequestedAlert(title: "Request for access",
                                           message: "Application <?> wants to access your credentials " +
                                                    // todo:    ^^^^^  insert application name
                                                    "from \(oidcRealmUrl)",
                                           actions: [
                                               AlertAction(title: "Deny", style: .cancel) { _ in
                                                   sendError("user denied access")
                                               },
                                               AlertAction(title: "Approve", style: .default) { _ in
                                                   sendIdToken(idToken)
                                               }
                                           ])
                dispatch(DialogPresenterActions.RequestAlert(requestedAlert: alert))
            }

            if let state = getState(),
               let facet = state.diamond.selectedFacet(),
               let idToken = facet.findToken(claim: "iss", value: oidcRealmUrl) {
                if alreadyProvided(idToken: idToken, state: state) {
                    sendIdToken(idToken)
                } else {
                    showRequestAccessDialog(idToken)
                }
            }
        })
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

import ReSwift
import ReSwiftThunk
import JWTDecode

// swiftlint:disable identifier_name

import Telepath

struct OpenIDAttestationActions {
    static func StartAttestation(
        for identity: Identity,
        requestId: JsonRpcId,
        oidcRealmUrl: URL,
        subject: String?,
        requestedOnChannel channelId: ChannelID? = nil) -> Thunk<AppState> {
        return Thunk { dispatch, _ in
            let handler = OpenIDAttestationStarter(
                oidcRealmUrl: oidcRealmUrl,
                onSuccess: { nonce in dispatch(Started(nonce: nonce)) },
                onError: { nonce, error in dispatch(StartRejected(nonce: nonce, error: error)) })
            dispatch(Pending(
                requestId: requestId,
                identity: identity,
                nonce: handler.nonce,
                subject: subject,
                requestedOnChannel: channelId
            ))
            handler.run()
        }
    }

    static func Finish(params: [String: String]) -> Thunk<AppState> {
        return Thunk { dispatch, getState in
            guard let idToken = params["id_token"] else {
                dispatch(FinishRejected(nonce: nil, error: "id token missing"))
                return
            }
            do {
                // TODO: This JWTDecode library does not check the JWT signature
                let jwt = try JWTDecode.decode(jwt: idToken)
                guard let nonce = jwt.claim(name: "nonce").string else {
                    dispatch(FinishRejected(nonce: nil, error: "nonce is missing"))
                    return
                }
                guard let state = getState(),
                      let pendingAttestation = state.attestations.open[nonce],
                      pendingAttestation.subject == jwt.subject else {
                    dispatch(FinishRejected(nonce: nonce, error: "unexpected nonce or subject"))
                    return
                }
                dispatch(DiamondActions.StoreOpenIDAttestation(identity: pendingAttestation.identity,
                                                          idToken: idToken))
                dispatch(Fulfilled(nonce: nonce, idToken: idToken))
                if let channelId = pendingAttestation.requestedOnChannel,
                   let channel = state.telepath.findChannel(id: channelId) {
                    GetAttestationsValid.send(
                        requestId: pendingAttestation.requestId,
                        idToken: idToken,
                        dispatch: dispatch,
                        state: state,
                        on: channel
                    )
                }
            } catch let e {
                dispatch(FinishRejected(nonce: nil, error: e.localizedDescription))
            }
        }
    }

    struct Pending: Action {
        let requestId: JsonRpcId
        let identity: Identity
        let nonce: String
        let subject: String?
        let requestedOnChannel: ChannelID?
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

    struct Provided: Action {
        let idToken: String
        let channel: ChannelID
    }

    static func GetAttestations(requestId: JsonRpcId,
                                applicationName: String,
                                oidcRealmUrl: String,
                                subject: String?,
                                channel: TelepathChannel) -> Thunk<AppState> {
        return Thunk { dispatch, getState in
            let builder = GetAttestationsBuilder(
                requestId: requestId,
                oidcRealmUrlString: oidcRealmUrl,
                applicationName: applicationName,
                subject: subject,
                dispatch: dispatch,
                getState: getState,
                channel: channel
            )
            builder.build().execute()
        }
    }
}

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import ReSwiftThunk
import JWTDecode

// swiftlint:disable identifier_name

import Telepath

struct AttestationActions {
    static func StartAttestation(
        for identity: Identity,
        requestId: JsonRpcId,
        oidcRealmUrl: URL,
        subject: String?,
        requestedOnChannel channelId: ChannelID? = nil) -> ThunkAction<AppState> {
        return ThunkAction { dispatch, _ in
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

    static func Finish(params: [String:String]) -> ThunkAction<AppState> {
        return ThunkAction { dispatch, getState in
            guard let idToken = params["id_token"] else {
                dispatch(FinishRejected(nonce: nil, error: "id token missing"))
                return
            }
            do {
                // This JWTDecode library does not check the JWT signature;
                // https://gitlab.ta.philips.com/blockchain-lab/Cogito/issues/8
                let jwt = try JWTDecode.decode(jwt: idToken)
                guard let nonce = jwt.claim(name: "nonce").string else {
                    dispatch(FinishRejected(nonce: nil, error: "nonce is missing"))
                    return
                }
                guard let state = getState(),
                      let pendingAttestation = state.attestations.open[nonce],
                      // https://gitlab.ta.philips.com/blockchain-lab/Cogito/issues/11
                      (pendingAttestation.subject == nil || pendingAttestation.subject! == jwt.subject) else {
                    dispatch(FinishRejected(nonce: nonce, error: "unexpected nonce or subject"))
                    return
                }
                dispatch(DiamondActions.AddJWTAttestation(identity: pendingAttestation.identity,
                                                          idToken: idToken))
                dispatch(Fulfilled(nonce: nonce, idToken: idToken))
                if let currentChannel = state.telepath.channel,
                   currentChannel.id == pendingAttestation.requestedOnChannel {
                    GetAttestationsValid.send(
                        requestId: pendingAttestation.requestId,
                        idToken: idToken,
                        dispatch: dispatch,
                        state: state
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
                                subject: String?) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, getState in
            let builder = GetAttestationsBuilder(
                requestId: requestId,
                oidcRealmUrlString: oidcRealmUrl,
                applicationName: applicationName,
                subject: subject,
                dispatch: dispatch,
                getState: getState
            )
            builder.build().execute()
        })
    }
}

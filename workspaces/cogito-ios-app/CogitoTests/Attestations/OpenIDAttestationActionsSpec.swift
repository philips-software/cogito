//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwiftThunk
import Telepath
import SwiftyJSON
@testable import Cogito

// swiftlint:disable:next type_body_length
class OpenIDAttestationActionsSpec: QuickSpec {
    // swiftlint:disable:next function_body_length
    override func spec() {
        describe("Finish") {
            it("dispatches FinishRejected when no token present") {
                let finishAction = OpenIDAttestationActions.Finish(params: [:])
                let dispatchRecorder = DispatchRecorder<OpenIDAttestationActions.FinishRejected>()
                finishAction.action(dispatchRecorder.dispatch, { return nil })
                expect(dispatchRecorder.count) == 1
            }

            it("dispatches FinishRejected when token is invalid") {
                let finishAction = OpenIDAttestationActions.Finish(params: ["id_token": "invalid token"])
                let dispatchRecorder = DispatchRecorder<OpenIDAttestationActions.FinishRejected>()
                finishAction.action(dispatchRecorder.dispatch, { return nil })
                expect(dispatchRecorder.count) == 1
            }

            it("dispatches FinishRejected when token has incorrect nonce") {
                let finishAction = OpenIDAttestationActions.Finish(params: ["id_token": OpenIdExampleValues.validToken])
                let dispatchRecorder = DispatchRecorder<OpenIDAttestationActions.FinishRejected>()
                finishAction.action(dispatchRecorder.dispatch, { return nil })
                expect(dispatchRecorder.count) == 1
            }

            it("dispatches FinishRejected when subject is incorrect") {
                let identity = Identity.example
                let finishAction = OpenIDAttestationActions.Finish(params: ["id_token": OpenIdExampleValues.validToken])
                let dispatchRecorder = DispatchRecorder<OpenIDAttestationActions.FinishRejected>()
                finishAction.action(dispatchRecorder.dispatch, {
                    return appState(attestations: AttestationsState(
                        open: [
                            OpenIdExampleValues.validNonce: AttestationInProgress(
                                requestId: JsonRpcId(),
                                nonce: OpenIdExampleValues.validNonce,
                                subject: "incorrect subject",
                                identity: identity,
                                status: .started,
                                error: "the error message",
                                idToken: nil,
                                requestedOnChannel: nil
                            )
                        ],
                        providedAttestations: [:])
                    )
                })
                expect(dispatchRecorder.count) == 1
            }

            it("dispatches Fulfilled when token has correct nonce") {
                let identity = Identity.example
                let finishAction = OpenIDAttestationActions.Finish(params: ["id_token": OpenIdExampleValues.validToken])
                let dispatchRecorder = DispatchRecorder<OpenIDAttestationActions.Fulfilled>()
                finishAction.action(dispatchRecorder.dispatch, {
                    return appState(attestations: AttestationsState(
                        open: [
                            OpenIdExampleValues.validNonce: AttestationInProgress(
                                requestId: JsonRpcId(),
                                nonce: OpenIdExampleValues.validNonce,
                                subject: OpenIdExampleValues.validSubject,
                                identity: identity,
                                status: .started,
                                error: nil,
                                idToken: nil,
                                requestedOnChannel: nil
                            )
                        ],
                        providedAttestations: [:])
                    )
                })
                expect(dispatchRecorder.count) == 1
            }

            it("dispatches Fulfilled also when subject is missing for easy demoing") {
                // This should normally not be possible in production, but we want to demo
                // a use case without actually requiring the web app to also authenticate with
                // the OpenID Connect server; hence the web app doesn't know what subject to
                // provide.
                // https://gitlab.ta.philips.com/blockchain-lab/Cogito/issues/11
                let identity = Identity.example
                let finishAction = OpenIDAttestationActions.Finish(params: ["id_token": OpenIdExampleValues.validToken])
                let dispatchRecorder = DispatchRecorder<OpenIDAttestationActions.Fulfilled>()
                finishAction.action(dispatchRecorder.dispatch, {
                    return appState(attestations: AttestationsState(
                        open: [
                            OpenIdExampleValues.validNonce: AttestationInProgress(
                                requestId: JsonRpcId(),
                                nonce: OpenIdExampleValues.validNonce,
                                subject: nil,
                                identity: identity,
                                status: .started,
                                error: nil,
                                idToken: nil,
                                requestedOnChannel: nil
                            )
                        ],
                        providedAttestations: [:]
                    ))
                })
                expect(dispatchRecorder.count) == 1
            }

            it("also dispatches DiamondActions.AddAttestation") {
                let identity = Identity.example
                let finishAction = OpenIDAttestationActions.Finish(params: ["id_token": OpenIdExampleValues.validToken])
                let dispatchRecorder = DispatchRecorder<DiamondActions.AddJWTAttestation>()
                finishAction.action(dispatchRecorder.dispatch, {
                    return appState(attestations: AttestationsState(
                        open: [
                            OpenIdExampleValues.validNonce: AttestationInProgress(
                                requestId: JsonRpcId(),
                                nonce: OpenIdExampleValues.validNonce,
                                subject: OpenIdExampleValues.validSubject,
                                identity: identity,
                                status: .started,
                                error: nil,
                                idToken: nil,
                                requestedOnChannel: nil
                            )
                        ],
                        providedAttestations: [:])
                    )
                })
                expect(dispatchRecorder.count) == 1
                expect(dispatchRecorder.actions.first!.identity) == identity
                expect(dispatchRecorder.actions.first!.idToken) == OpenIdExampleValues.validToken
            }
        }

        describe("getting attestations") {
            let requestId = JsonRpcId("a request id")
            let idToken = OpenIdExampleValues.validToken
            var store: RecordingStore!
            var identityWithAttestation: Identity!
            var identityWithoutAttestation: Identity!
            var channel: TelepathChannelSpy!
            var telepathState: TelepathState!
            var getAttestationsAction: ThunkAction<AppState>!

            func sendPendingAction() -> TelepathActions.SendPending? {
                return store.firstAction(ofType: TelepathActions.SendPending.self)
            }

            func requestAlertAction() -> DialogPresenterActions.RequestAlert? {
                return store.firstAction(ofType: DialogPresenterActions.RequestAlert.self)
            }

            beforeEach {
                identityWithoutAttestation = Identity.example
                identityWithAttestation = Identity.example
                identityWithAttestation.idTokens = [idToken]
                channel = TelepathChannelSpy()
                telepathState = TelepathState(
                    channels: [channel: identityWithoutAttestation.identifier],
                    connectionError: nil,
                    receivedMessages: [],
                    receiveError: nil
                )
                store = RecordingStore()
                getAttestationsAction = OpenIDAttestationActions.GetAttestations(
                    requestId: requestId,
                    applicationName: "test",
                    oidcRealmUrl: OpenIdExampleValues.validIssuer,
                    subject: nil,
                    channel: channel
                )
            }

            context("when requested attestation is present") {
                beforeEach {
                    telepathState = TelepathState(
                        channels: [channel: identityWithAttestation.identifier],
                        connectionError: nil,
                        receivedMessages: [],
                        receiveError: nil
                    )
                }

                context("when this Telepath channel has been given the attestation before") {
                    beforeEach {
                        store.state = appState(
                            diamond: DiamondState(facets: [identityWithAttestation]),
                            telepath: telepathState,
                            attestations: AttestationsState(open: [:], providedAttestations: [
                                channel.id: [idToken]
                            ])
                        )
                    }

                    it("only dispatches Telepath send message") {
                        let action = getAttestationsAction!
                        store.dispatch(action)
                        let response = JSON(parseJSON: sendPendingAction()!.message)
                        expect(response["id"]) == requestId.json
                        expect(response["result"].string) == idToken
                    }
                }

                context("when this Telepath channel has not been given the attestation yet") {
                    beforeEach {
                        store.state = appState(
                            diamond: DiamondState(facets: [identityWithAttestation]),
                            telepath: telepathState
                        )
                        let action = getAttestationsAction!
                        store.dispatch(action)
                    }

                    it("asks the user to confirm that the attestation may be sent") {
                        let alert = requestAlertAction()
                        expect(alert?.requestedAlert.title) == "Request for access"
                    }

                    context("when user confirms") {
                        it("sends Telepath message containing token") {
                            guard let requestAlertAction = requestAlertAction(),
                                  let approveAction = requestAlertAction.requestedAlert.actions.filter({
                                      $0.style == .default
                                  }).first else {
                                fail("unexpected state")
                                return
                            }
                            approveAction.handler!(approveAction)
                            let response = JSON(parseJSON: sendPendingAction()!.message)
                            expect(response["id"]) == requestId.json
                            expect(response["result"].string) == idToken
                            let attestationProvided = store.actions.contains { $0 is OpenIDAttestationActions.Provided }
                            expect(attestationProvided).to(beTrue())
                        }
                    }

                    context("when user rejects") {
                        it("sends Telepath message containing error") {
                            guard let requestAlertAction = requestAlertAction(),
                                  let cancelAction = requestAlertAction.requestedAlert.actions.filter({
                                      $0.style == .cancel
                                  }).first else {
                                fail("unexpected state")
                                return
                            }
                            cancelAction.handler!(cancelAction)
                            let response = JSON(parseJSON: sendPendingAction()!.message)
                            expect(response["error"]["code"].int) == AttestationError.userDeniedAccess.code
                        }
                    }
                }
            }

            context("when requested attestation is not present") {
                beforeEach {
                    store.state = appState(
                        diamond: DiamondState(facets: [identityWithoutAttestation]),
                        telepath: telepathState
                    )
                    let action = getAttestationsAction!
                    store.dispatch(action)
                }

                it("asks the user to confirm starting attestation flow") {
                    let alert = requestAlertAction()
                    expect(alert?.requestedAlert.title) == "Login required"
                }

                context("when user confirms") {
                    it("starts attestation flow") {
                        let alert = requestAlertAction()!
                        let loginAction = alert.requestedAlert.actions.filter({ $0.style == .default }).first!
                        loginAction.handler!(loginAction)
                        let pending = store.firstAction(ofType: OpenIDAttestationActions.Pending.self)
                        expect(pending?.requestedOnChannel) == channel.id
                    }
                }

                context("when user rejects") {
                    it("sends Telepath message containing 'rejected'") {
                        let alert = requestAlertAction()!
                        let cancelAction = alert.requestedAlert.actions.filter({ $0.style == .cancel }).first!
                        cancelAction.handler!(cancelAction)
                        let response = JSON(parseJSON: sendPendingAction()!.message)
                        expect(response["error"]["code"].int) == AttestationError.userCancelledLogin.code
                    }
                }

                context("when the attestation becomes available") {
                    func attestationInProgress(channelId: ChannelID) -> AttestationInProgress {
                        return AttestationInProgress(
                            requestId: requestId,
                            nonce: OpenIdExampleValues.validNonce,
                            subject: OpenIdExampleValues.validSubject,
                            identity: identityWithoutAttestation,
                            status: .started,
                            error: nil,
                            idToken: nil,
                            requestedOnChannel: channelId
                        )
                    }

                    context("when channel has not changed") {
                        it("dispatches Telepath send message") {
                            let finishAction = OpenIDAttestationActions.Finish(
                                params: ["id_token": OpenIdExampleValues.validToken]
                            )
                            store.state = appState(
                                diamond: DiamondState(facets: [identityWithoutAttestation]),
                                telepath: telepathState,
                                attestations: AttestationsState(
                                    open: [
                                        OpenIdExampleValues.validNonce: attestationInProgress(channelId: channel.id)
                                    ],
                                    providedAttestations: [:])
                            )
                            store.dispatch(finishAction)
                            let response = JSON(parseJSON: sendPendingAction()!.message)
                            expect(response["id"]) == requestId.json
                            expect(response["result"].string) == idToken
                            let attestationProvided = store.actions.contains { $0 is OpenIDAttestationActions.Provided }
                            expect(attestationProvided).to(beTrue())
                        }
                    }

                    context("when channel has changed") {
                        it("does not dispatch Telepath send message") {
                            let finishAction = OpenIDAttestationActions.Finish(
                                params: ["id_token": OpenIdExampleValues.validToken]
                            )
                            store.state = appState(
                                diamond: DiamondState(facets: [identityWithoutAttestation]),
                                telepath: telepathState,
                                attestations: AttestationsState(
                                    open: [OpenIdExampleValues.validNonce: attestationInProgress(channelId: "other")],
                                    providedAttestations: [:])
                            )
                            store.dispatch(finishAction)
                            expect(sendPendingAction()).to(beNil())
                        }
                    }
                }
            }

            it("sends error when realm URL is invalid") {
                let action = OpenIDAttestationActions.GetAttestations(
                    requestId: requestId,
                    applicationName: "test",
                    oidcRealmUrl: "invalid url",
                    subject: nil,
                    channel: channel
                )
                store.dispatch(action)
                let response = JSON(parseJSON: sendPendingAction()!.message)
                expect(response["error"]["code"].int) == AttestationError.invalidRealmUrl.code
                expect(response["id"]) == requestId.json
            }
        }

        describe("multiple identities") {
            it("uses the identity associated with the telepath channel") {
                let identity1 = Identity(description: "test identity 1", address: Address.testAddress1)
                let identity2 = Identity(description: "test identity 2", address: Address.testAddress2)
                var diamondState = DiamondState(facets: [identity1, identity2])
                diamondState.selectedFacetId = identity1.identifier
                let channel = TelepathChannelSpy()
                let state = appState(
                    diamond: diamondState,
                    telepath: TelepathState(
                        channels: [channel: identity2.identifier],
                        connectionError: nil,
                        receivedMessages: [],
                        receiveError: nil
                    )
                )
                let builder = GetAttestationsBuilder(
                    requestId: JsonRpcId(1), oidcRealmUrlString: "https://test.realm", applicationName: "app",
                    subject: "sub", dispatch: { _ in }, getState: { return state }, channel: channel
                )
                let attestationsGetter = builder.build() as? GetAttestationsValid
                expect(attestationsGetter?.facet) == identity2
            }
        }
    }
}

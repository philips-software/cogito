//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwiftThunk
import Telepath
import SwiftyJSON

// swiftlint:disable:next type_body_length
class AttestationActionsSpec: QuickSpec {
    // swiftlint:disable:next function_body_length
    override func spec() {
        describe("Finish") {
            it("dispatches FinishRejected when no token present") {
                let finishAction = AttestationActions.Finish(params: [:])
                let dispatchRecorder = DispatchRecorder<AttestationActions.FinishRejected>()
                finishAction.action(dispatchRecorder.dispatch, { return nil })
                expect(dispatchRecorder.count) == 1
            }

            it("dispatches FinishRejected when token is invalid") {
                let finishAction = AttestationActions.Finish(params: ["id_token": "invalid token"])
                let dispatchRecorder = DispatchRecorder<AttestationActions.FinishRejected>()
                finishAction.action(dispatchRecorder.dispatch, { return nil })
                expect(dispatchRecorder.count) == 1
            }

            it("dispatches FinishRejected when token has incorrect nonce") {
                let finishAction = AttestationActions.Finish(params: ["id_token": validToken])
                let dispatchRecorder = DispatchRecorder<AttestationActions.FinishRejected>()
                finishAction.action(dispatchRecorder.dispatch, { return nil })
                expect(dispatchRecorder.count) == 1
            }

            it("dispatches FinishRejected when subject is incorrect") {
                let identity = Identity(description: "test identity", address: Address.testAddress1)
                let finishAction = AttestationActions.Finish(params: ["id_token": validToken])
                let dispatchRecorder = DispatchRecorder<AttestationActions.FinishRejected>()
                finishAction.action(dispatchRecorder.dispatch, {
                    return appState(attestations: AttestationsState(
                        open: [
                            validNonce: AttestationInProgress(
                                requestId: JsonRpcId(),
                                nonce: validNonce,
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
                let identity = Identity(description: "test identity", address: Address.testAddress1)
                let finishAction = AttestationActions.Finish(params: ["id_token": validToken])
                let dispatchRecorder = DispatchRecorder<AttestationActions.Fulfilled>()
                finishAction.action(dispatchRecorder.dispatch, {
                    return appState(attestations: AttestationsState(
                        open: [
                            validNonce: AttestationInProgress(
                                requestId: JsonRpcId(),
                                nonce: validNonce,
                                subject: validSubject,
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
                let identity = Identity(description: "test identity", address: Address.testAddress1)
                let finishAction = AttestationActions.Finish(params: ["id_token": validToken])
                let dispatchRecorder = DispatchRecorder<AttestationActions.Fulfilled>()
                finishAction.action(dispatchRecorder.dispatch, {
                    return appState(attestations: AttestationsState(
                        open: [
                            validNonce: AttestationInProgress(
                                requestId: JsonRpcId(),
                                nonce: validNonce,
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
                let identity = Identity(description: "test identity", address: Address.testAddress1)
                let finishAction = AttestationActions.Finish(params: ["id_token": validToken])
                let dispatchRecorder = DispatchRecorder<DiamondActions.AddJWTAttestation>()
                finishAction.action(dispatchRecorder.dispatch, {
                    return appState(attestations: AttestationsState(
                        open: [
                            validNonce: AttestationInProgress(
                                requestId: JsonRpcId(),
                                nonce: validNonce,
                                subject: validSubject,
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
                expect(dispatchRecorder.actions.first!.idToken) == validToken
            }
        }

        describe("getting attestations") {
            let requestId = JsonRpcId("a request id")
            let idToken = validToken
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
                channel = TelepathChannelSpy()
                telepathState = TelepathState(channel: channel, connectionError: nil,
                                              receivedMessages: [], receiveError: nil)
                store = RecordingStore()
                identityWithoutAttestation = Identity(description: "test", address: Address.testAddress)
                identityWithAttestation = Identity(description: "test", address: Address.testAddress)
                identityWithAttestation.idTokens = [idToken]
                getAttestationsAction = AttestationActions.GetAttestations(
                    requestId: requestId,
                    applicationName: "test",
                    oidcRealmUrl: validIssuer,
                    subject: nil,
                    channel: channel
                )
            }

            context("when requested attestation is present") {
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
                            let attestationProvided = store.actions.contains { $0 is AttestationActions.Provided }
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
                        let pending = store.firstAction(ofType: AttestationActions.Pending.self)
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
                            nonce: validNonce,
                            subject: validSubject,
                            identity: identityWithoutAttestation,
                            status: .started,
                            error: nil,
                            idToken: nil,
                            requestedOnChannel: channelId
                        )
                    }

                    context("when channel has not changed") {
                        it("dispatches Telepath send message") {
                            let finishAction = AttestationActions.Finish(params: ["id_token": validToken])
                            store.state = appState(
                                diamond: DiamondState(facets: [identityWithoutAttestation]),
                                telepath: telepathState,
                                attestations: AttestationsState(
                                    open: [validNonce: attestationInProgress(channelId: channel.id)],
                                    providedAttestations: [:])
                            )
                            store.dispatch(finishAction)
                            let response = JSON(parseJSON: sendPendingAction()!.message)
                            expect(response["id"]) == requestId.json
                            expect(response["result"].string) == idToken
                            let attestationProvided = store.actions.contains { $0 is AttestationActions.Provided }
                            expect(attestationProvided).to(beTrue())
                        }
                    }

                    context("when channel has changed") {
                        it("does not dispatch Telepath send message") {
                            let finishAction = AttestationActions.Finish(params: ["id_token": validToken])
                            store.state = appState(
                                diamond: DiamondState(facets: [identityWithoutAttestation]),
                                telepath: telepathState,
                                attestations: AttestationsState(
                                    open: [validNonce: attestationInProgress(channelId: "other")],
                                    providedAttestations: [:])
                            )
                            store.dispatch(finishAction)
                            expect(sendPendingAction()).to(beNil())
                        }
                    }
                }
            }

            context("when there is no identity yet") {
                it("sends 'invalid configuration'") {
                    let action = getAttestationsAction!
                    store.state = appState(
                        diamond: DiamondState(facets: []),
                        telepath: telepathState,
                        attestations: AttestationsState(open: [:], providedAttestations: [
                            channel.id: [idToken]
                        ])
                    )
                    store.dispatch(action)
                    let response = JSON(parseJSON: sendPendingAction()!.message)
                    expect(response["error"]["code"].int) == AttestationError.invalidConfiguration.code
                    expect(response["id"]) == requestId.json
                }
            }

            it("sends error when realm URL is invalid") {
                let action = AttestationActions.GetAttestations(
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
    }
}

private let validToken = "eyJhbGciOiJSUzI1NiIsInR5c" +
                         "CIgOiAiSldUIiwia2lkIiA6ICJ0U1huMHQtVV9MWUFnTXZacFM0aF9KQUE5Y1RZWWQ2MX" +
                         "M2aF8zT0dhLXVjIn0.eyJqdGkiOiJlN2NiZmY3Mi1lZDY3LTRkMTUtOGE2MC00NDdhMjl" +
                         "iZGVjMDkiLCJleHAiOjE1MDkwMTEyMjEsIm5iZiI6MCwiaWF0IjoxNTA5MDEwMzIxLCJp" +
                         "c3MiOiJodHRwOi8vZWMyLTM1LTE1OC0yMC0xNjEuZXUtY2VudHJhbC0xLmNvbXB1dGUuY" +
                         "W1hem9uYXdzLmNvbTo4MDgwL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6ImNvZ2l0by" +
                         "IsInN1YiI6IjkzYWIxMjc1LWY3ZTItNGFmNi04YWE5LTRjYzM0YjdiZTMwNyIsInR5cCI" +
                         "6IklEIiwiYXpwIjoiY29naXRvIiwibm9uY2UiOiJhMGViMjkxYjhiYjYwMWVmMDhlNDVm" +
                         "MWZjZWMzNWI3YjMyYWNiNzllNTUyZjY2NjY0YzRhMjUzMzMzMGVlZTcxIiwiYXV0aF90a" +
                         "W1lIjoxNTA5MDEwMzIxLCJzZXNzaW9uX3N0YXRlIjoiMDYyNjFhN2EtMjgyZi00MTEzLT" +
                         "hmYmQtNTFiMzJhMTY5YjI2IiwiYWNyIjoiMSIsIm5hbWUiOiJEZW1vIFVzZXIiLCJwcmV" +
                         "mZXJyZWRfdXNlcm5hbWUiOiJkZW1vIiwiZ2l2ZW5fbmFtZSI6IkRlbW8iLCJmYW1pbHlf" +
                         "bmFtZSI6IlVzZXIiLCJlbWFpbCI6ImRlbW9AZXhhbXBsZS5jb20ifQ.OxBNXYenPWDO93" +
                         "XhNn9wa7thfuPW4hVarQd4ufZHNFKl2iagcByZ95rtGd065u-B5hSpgEcTXtencr2Gf5W" +
                         "mWvQbMvoskyP5DXVtpNTz_hYwbS6ga24f-tr-WKGG6cqJzXEgrsN4P0YJzP6Uv_GIiLU6" +
                         "qucGjpK-pNSN6kJr9IKlQEpow_ERkyVIFaBtuzVT0fi6nfIskKOwzhJwf0eK-VX7o6mJa" +
                         "fzinyXc1wC-rGNb5rtbHbC1qx8Se4-gp-G0EDTa3iChS7m_ZDdXjMmnp22poRv1M8W3Ft" +
                         "rnfAnMyyDxr8AZwTefCQN9-3ge3hmBS7nBjlrrYkmwSTpAlJGHOg"
private let validNonce = "a0eb291b8bb601ef08e45f1fcec35b7b32acb79e552f66664c4a2533330eee71"
private let validSubject = "93ab1275-f7e2-4af6-8aa9-4cc34b7be307"
private let validIssuer = "http://ec2-35-158-20-161.eu-central-1.compute.amazonaws.com:8080/auth/realms/master"

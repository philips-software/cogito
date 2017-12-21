//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class AttestationsReducerSpec: QuickSpec {
    override func spec() {
        let identity1 = Identity(description: "identity1", address: Address.testAddress1)
        let identity2 = Identity(description: "identity2", address: Address.testAddress1)

        it("handles pending") {
            let initialState = AttestationsState(open: ["nonce1": AttestationInProgress(nonce: "nonce1",
                                                                                        subject: "subject1",
                                                                                        identity: identity1,
                                                                                        status: .started,
                                                                                        error: nil,
                                                                                        idToken: nil,
                                                                                        requestedOnChannel: nil)],
                                                 providedAttestations: [:])
            let action = AttestationActions.Pending(identity: identity2,
                                                    nonce: "nonce2",
                                                    subject: "subject2",
                                                    requestedOnChannel: "channelId")
            let nextState = attestationsReducer(action: action, state: initialState)
            expect(nextState.open) == [
                "nonce1": AttestationInProgress(
                    nonce: "nonce1", subject: "subject1", identity: identity1, status: .started,
                    error: nil, idToken: nil, requestedOnChannel: nil),
                "nonce2": AttestationInProgress(
                    nonce: "nonce2", subject: "subject2", identity: identity2, status: .pending,
                    error: nil, idToken: nil, requestedOnChannel: "channelId")
            ]
        }

        it("handles started") {
            let initialState = AttestationsState(open: ["nonce1": AttestationInProgress(nonce: "nonce1",
                                                                                        subject: "subject1",
                                                                                        identity: identity1,
                                                                                        status: .pending,
                                                                                        error: nil,
                                                                                        idToken: nil,
                                                                                        requestedOnChannel: nil)],
                                                 providedAttestations: [:])
            let action = AttestationActions.Started(nonce: "nonce1")
            let nextState = attestationsReducer(action: action, state: initialState)
            expect(nextState.open["nonce1"]!.status) == AttestationInProgress.Status.started
        }

        it("handles start rejected") {
            let initialState = AttestationsState(open: ["nonce1": AttestationInProgress(nonce: "nonce1",
                                                                                        subject: "subject1",
                                                                                        identity: identity1,
                                                                                        status: .pending,
                                                                                        error: nil,
                                                                                        idToken: nil,
                                                                                        requestedOnChannel: nil)],
                                                 providedAttestations: [:])
            let action = AttestationActions.StartRejected(nonce: "nonce1", error: "some error")
            let nextState = attestationsReducer(action: action, state: initialState)
            expect(nextState.open["nonce1"]!.status) == AttestationInProgress.Status.startRejected
            expect(nextState.open["nonce1"]!.error) == "some error"
        }

        it("handles finish rejected") {
            let initialState = AttestationsState(open: ["nonce1": AttestationInProgress(nonce: "nonce1",
                                                                                        subject: "subject1",
                                                                                        identity: identity1,
                                                                                        status: .started,
                                                                                        error: nil,
                                                                                        idToken: nil,
                                                                                        requestedOnChannel: nil)],
                                                 providedAttestations: [:])
            let action = AttestationActions.FinishRejected(nonce: "nonce1", error: "some error")
            let nextState = attestationsReducer(action: action, state: initialState)
            expect(nextState.open["nonce1"]!.status) == AttestationInProgress.Status.finishRejected
            expect(nextState.open["nonce1"]!.error) == "some error"
        }

        it("handles fulfilled") {
            let initialState = AttestationsState(open: ["nonce1": AttestationInProgress(nonce: "nonce1",
                                                                                        subject: "subject1",
                                                                                        identity: identity1,
                                                                                        status: .started,
                                                                                        error: nil,
                                                                                        idToken: nil,
                                                                                        requestedOnChannel: nil)],
                                                 providedAttestations: [:])
            let action = AttestationActions.Fulfilled(nonce: "nonce1", idToken: "some token")
            let nextState = attestationsReducer(action: action, state: initialState)
            expect(nextState.open["nonce1"]!.status) == AttestationInProgress.Status.fulfilled
            expect(nextState.open["nonce1"]!.error).to(beNil())
            expect(nextState.open["nonce1"]!.idToken) == "some token"
         }

        it("handles Provided for new channel id") {
            let initialState = AttestationsState(open: [:], providedAttestations: [:])
            let action = AttestationActions.Provided(idToken: "idToken", channel: "channelId")
            let nextState = attestationsReducer(action: action, state: initialState)
            expect(nextState.providedAttestations["channelId"]) == ["idToken"]
        }

        it("handles Provided for existing channel id") {
            let initialState = AttestationsState(open: [:], providedAttestations: ["channelId": ["foo"]])
            let action = AttestationActions.Provided(idToken: "idToken", channel: "channelId")
            let nextState = attestationsReducer(action: action, state: initialState)
            expect(nextState.providedAttestations["channelId"]) == ["foo", "idToken"]
        }

        it("handles Provided for existing channel id: no duplicates") {
            let initialState = AttestationsState(open: [:], providedAttestations: ["channelId": ["idToken"]])
            let action = AttestationActions.Provided(idToken: "idToken", channel: "channelId")
            let nextState = attestationsReducer(action: action, state: initialState)
            expect(nextState.providedAttestations["channelId"]) == ["idToken"]
        }
    }
}

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
                                                                                        error: nil)])
            let action = AttestationActions.Pending(identity: identity2,
                                                    nonce: "nonce2",
                                                    subject: "subject2")
            let nextState = attestationsReducer(action: action, state: initialState)
            expect(nextState.open) == [
                "nonce1": AttestationInProgress(
                    nonce: "nonce1", subject: "subject1", identity: identity1, status: .started, error: nil),
                "nonce2": AttestationInProgress(
                    nonce: "nonce2", subject: "subject2", identity: identity2, status: .pending, error: nil)
            ]
        }

        it("handles started") {
            let initialState = AttestationsState(open: ["nonce1": AttestationInProgress(nonce: "nonce1",
                                                                                        subject: "subject1",
                                                                                        identity: identity1,
                                                                                        status: .pending,
                                                                                        error: nil)])
            let action = AttestationActions.Started(nonce: "nonce1")
            let nextState = attestationsReducer(action: action, state: initialState)
            expect(nextState.open["nonce1"]!.status) == AttestationInProgress.Status.started
        }

        it("handles start rejected") {
            let initialState = AttestationsState(open: ["nonce1": AttestationInProgress(nonce: "nonce1",
                                                                                        subject: "subject1",
                                                                                        identity: identity1,
                                                                                        status: .pending,
                                                                                        error: nil)])
            let action = AttestationActions.StartRejected(nonce: "nonce1", error: "some error")
            let nextState = attestationsReducer(action: action, state: initialState)
            expect(nextState.open["nonce1"]!.status) == AttestationInProgress.Status.startRejected
            expect(nextState.open["nonce1"]!.error) == "some error"
        }
    }
}

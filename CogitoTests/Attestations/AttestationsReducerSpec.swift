//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class AttestationsReducerSpec: QuickSpec {
    override func spec() {
        let identity1 = Identity(description: "identity1", address: Address.testAddress1)
        let identity2 = Identity(description: "identity2", address: Address.testAddress1)

        it("handles pending") {
            let initialState = AttestationsState(pending: ["nonce1": PendingAttestation(nonce: "nonce1",
                                                                                        subject: "subject1",
                                                                                        identity: identity1,
                                                                                        status: .started)])
            let action = AttestationActions.Pending(identity: identity2,
                                                    nonce: "nonce2",
                                                    subject: "subject2")
            let nextState = attestationsReducer(action: action, state: initialState)
            expect(nextState.pending) == [
                "nonce1": PendingAttestation(
                    nonce: "nonce1", subject: "subject1", identity: identity1, status: .started),
                "nonce2": PendingAttestation(
                    nonce: "nonce2", subject: "subject2", identity: identity2, status: .pending)
            ]
        }

        it("handles started") {
            let initialState = AttestationsState(pending: ["nonce1": PendingAttestation(nonce: "nonce1",
                                                                                        subject: "subject1",
                                                                                        identity: identity1,
                                                                                        status: .pending)])
            let action = AttestationActions.Started(nonce: "nonce1")
            let nextState = attestationsReducer(action: action, state: initialState)
            expect(nextState.pending["nonce1"]!.status) == PendingAttestation.Status.started
        }
    }
}

//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
@testable import Cogito

class AttestationActionsSpec: QuickSpec {
    override func spec() {
        var store: RecordingStore!

        beforeEach {
            store = RecordingStore()
        }

        context("when an attestation is received") {
            let attestationUrl = URL(string: "https://cogito.example.com/attestations/receive#A=abcdef")!

            beforeEach {
                store.dispatch(AttestationActions.ReceiveAttestation(url: attestationUrl))
            }

            it("parses the attestation") {
                let action = store.firstAction(ofType: AttestationActions.AttestationReceived.self)
                expect(action?.attestation) == "abcdef"
            }
        }
    }
}

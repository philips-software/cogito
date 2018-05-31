//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
@testable import Cogito

class AttestationActionsSpec: QuickSpec {
    override func spec() {
        var store: RecordingStore!

        beforeEach {
            var identity = Identity.example
            identity.attestations = ["twitter:@examplebob", "email:bob@example.com", "phone:+1234567890"]
            store = RecordingStore()
            store.state = appState(diamond: DiamondState(facets: [identity]))
        }

        context("when an attestation is received") {
            let attestationUrl = URL(string:
                "https://cogito.example.com/attestations/receive#A=email%3Abob%40example.com"
            )!

            beforeEach {
                store.dispatch(AttestationActions.ReceiveAttestation(url: attestationUrl))
            }

            it("parses the attestation") {
                let action = store.firstAction(ofType: DiamondActions.StoreAttestation.self)
                expect(action?.attestation) == "email:bob@example.com"
            }
        }

        context("when attestations are requested") {
            var channel: TelepathChannelSpy!

            beforeEach {
                channel = TelepathChannelSpy()
                store.dispatch(AttestationActions.GetAttestations(
                    type: "email",
                    requestId: JsonRpcId(),
                    channel: channel
                ))
            }

            it("replies with matching attestations") {
                expect(channel.sentMessage).toNot(contain("twitter:@examplebob"))
                expect(channel.sentMessage).toNot(contain("phone:+1234567890"))
                expect(channel.sentMessage).to(contain("email:bob@example.com"))
            }
        }
    }
}

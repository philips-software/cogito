//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwiftThunk
@testable import Cogito

class AttestationServiceSpec: QuickSpec {
    override func spec() {
        let realmUrl = "https://iam-blockchain-dev.cogito.mobi/auth/realms/master"
        let attestationsRequest = JsonRpcRequest(
            method: "attestations",
            params: JsonRpcParams([
                "app": "test",
                "realmUrl": realmUrl
            ])
        )

        var service: AttestationService!
        var store: StoreSpy!

        beforeEach {
            store = StoreSpy()
            service = AttestationService(store: store)
        }

        describe("when an attestations request comes in") {
            beforeEach {
                service.onRequest(attestationsRequest, on: TelepathChannel.example)
            }

            it("dispatches the GetAttestations action") {
                expect(store.actions.last as? ThunkAction<AppState>).toNot(beNil())
            }
        }

        describe("when a different request comes in") {
            beforeEach {
                let request = JsonRpcRequest(
                    method: "other",
                    params: JsonRpcParams([
                        "app": "test",
                        "realmUrl": realmUrl
                    ])
                )
                service.onRequest(request, on: TelepathChannel.example)
            }

            it("is ignored") {
                expect(store.actions.last as? ThunkAction<AppState>).to(beNil())
            }

        }
    }
}

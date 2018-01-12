//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwiftThunk

class AttestationServiceSpec: QuickSpec {
    override func spec() {
        let realmUrl = "https://iam-blockchain-dev.cogito.mobi/auth/realms/master"
        let attestationsRequest = JsonRpcRequest(
            id: JsonRpcId(1),
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
                service.onRequest(attestationsRequest)
            }

            it("dispatches the GetAttestations action") {
                expect(store.actions.last as? ThunkAction<AppState>).toNot(beNil())
            }
        }
    }
}

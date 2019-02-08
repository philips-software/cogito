import Quick
import Nimble
import ReSwiftThunk
@testable import Cogito

class AttestationServiceSpec: QuickSpec {
    override func spec() {
        var service: AttestationService!
        var store: StoreSpy!

        beforeEach {
            store = StoreSpy()
            service = AttestationService(store: store)
        }

        describe("when an OpenID attestations request comes in") {
            let realmUrl = "https://iam-blockchain-dev.cogito.mobi/auth/realms/master"
            let attestationsRequest = JsonRpcRequest(
                method: "attestations",
                params: JsonRpcParams([
                    "app": "test",
                    "realmUrl": realmUrl
                    ])
            )

            beforeEach {
                service.onRequest(attestationsRequest, on: TelepathChannel.example)
            }

            it("dispatches the OpenID GetAttestations action") {
                expect(store.actions.last as? Thunk<AppState>).toNot(beNil())
            }
        }

        describe("when an attestations request comes in") {
            let request = JsonRpcRequest(
                method: "attestations",
                params: JsonRpcParams([ "type": "email" ])
            )

            beforeEach {
                service.onRequest(request, on: TelepathChannel.example)
            }

            it("dispatches the GetAttestations action") {
                expect(store.actions.last as? Thunk<AppState>).toNot(beNil())
            }

        }

        describe("when a different request comes in") {
            beforeEach {
                let request = JsonRpcRequest(method: "other")
                service.onRequest(request, on: TelepathChannel.example)
            }

            it("is ignored") {
                expect(store.actions.last as? Thunk<AppState>).to(beNil())
            }
        }
    }
}

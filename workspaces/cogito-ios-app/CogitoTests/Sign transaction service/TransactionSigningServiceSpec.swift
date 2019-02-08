import Quick
import Nimble
import ReSwiftThunk
@testable import Cogito

class TransactionSigningServiceSpec: QuickSpec {
    override func spec() {
        let signRequest = JsonRpcRequest(method: "sign", params: JsonRpcParams(parseJSON: "[{}]"))

        var service: TransactionSigningService!
        var store: StoreSpy!

        beforeEach {
            store = StoreSpy()
            service = TransactionSigningService(store: store)
        }

        context("when a sign requests comes in") {
            beforeEach {
                service.onRequest(signRequest, on: TelepathChannel.example)
            }

            it("dispatches the SignTransaction action") {
                expect(store.actions.last as? Thunk<AppState>).toNot(beNil())
            }
        }

        context("when a different request comes in") {
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

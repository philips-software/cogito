import Quick
import Nimble
@testable import Cogito

class IdentityInfoServiceSpec: QuickSpec {
    override func spec() {
        var service: IdentityInfoService!
        var store: RecordingStore!
        var channel: TelepathChannel!
        var identity: Identity!

        beforeEach {
            store = RecordingStore()
            service = IdentityInfoService(store: store)
            channel = TelepathChannelSpy()
            identity = Identity.example
        }

        context("when a request for identity properties comes in") {
            let request = JsonRpcRequest(
                method: "getIdentityInfo",
                params: JsonRpcParams(parseJSON: "{\"properties\":[\"username\",\"ethereumAddress\"]}")
            )

            beforeEach {
                store.state = appState(
                    diamond: DiamondState(facets: [identity]),
                    telepath: TelepathState(channels: [channel: identity.identifier])
                )
                service.onRequest(request, on: channel)
            }

            context("when the identity is found") {
                it("returns the identity properties") {
                    let sendPendingAction = store.firstAction(ofType: TelepathActions.SendPending.self)
                    expect(sendPendingAction?.message).to(contain("ethereumAddress"))
                    expect(sendPendingAction?.message).to(contain(identity.address.value))
                    expect(sendPendingAction?.message).to(contain("username"))
                    expect(sendPendingAction?.message).to(contain(identity.description))
                }
            }
        }
    }
}

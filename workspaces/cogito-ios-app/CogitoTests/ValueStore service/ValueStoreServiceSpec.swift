import Quick
import Nimble
@testable import Cogito

class ValueStoreServiceSpec: QuickSpec {
    override func spec() {
        let someKey = "someKey"
        let someValue = "someValue"
        var service: ValueStoreService!
        var store: RecordingStore!
        var channel: TelepathChannel!
        var identity: Identity!

        func createRequest(method: String, paramsString: String) -> JsonRpcRequest {
            return JsonRpcRequest(
                method: method,
                params: JsonRpcParams(parseJSON: paramsString)
            )
        }

        func sendRequest(method: String, paramsString: String) {
            let request = createRequest(method: method, paramsString: paramsString)
            service.onRequest(request, on: channel)
        }

        func getFirstSendPendingAction() -> TelepathActions.SendPending? {
            return store.firstAction(ofType: TelepathActions.SendPending.self)
        }

        func getLastSendPendingAction() -> TelepathActions.SendPending? {
            return store.lastAction(ofType: TelepathActions.SendPending.self)
        }

        beforeEach {
            channel = TelepathChannelSpy()
            identity = Identity.example
            store = RecordingStore(reducer: appReducer, state: appState(
                telepath: TelepathState(channels: [channel: identity.identifier]),
                valueStore: ValueStoreState(store: [someKey: someValue])
            ))
            service = ValueStoreService(store: store)
        }

        it("allows adding a new key-value pair") {
            sendRequest(
                method: "addKeyValuePair",
                paramsString: "{\"key\":\"newKey\",\"value\":\"newValue\"}")
            var sendPendingAction = getFirstSendPendingAction()
            expect(sendPendingAction?.message).to(contain("success"))

            sendRequest(
                method: "getValueForKey",
                paramsString: "{\"key\":\"newKey\"}"
            )
            sendPendingAction = getLastSendPendingAction()
            expect(sendPendingAction?.message).to(contain("newValue"))
        }

        it("returns the value for the key") {
            sendRequest(
                method: "getValueForKey",
                paramsString: "{\"key\":\"\(someKey)\"}"
            )

            let sendPendingAction = getFirstSendPendingAction()
            expect(sendPendingAction?.message).to(contain(someValue))
        }

        it("returns null when key does not exist") {
            sendRequest(
                method: "getValueForKey",
                paramsString: "{\"key\":\"doesNotExist\"}"
            )

            let sendPendingAction = getFirstSendPendingAction()
            expect(sendPendingAction?.message).to(contain("null"))
        }

        it("deletes an existing key pair") {
            sendRequest(
                method: "deleteKey",
                paramsString: "{\"key\":\"\(someKey)\"}"
            )

            var sendPendingAction = getFirstSendPendingAction()
            expect(sendPendingAction?.message).to(contain("success"))

            sendRequest(
                method: "getValueForKey",
                paramsString: "{\"key\":\"\(someKey)\"}"
            )

            sendPendingAction = getLastSendPendingAction()
            expect(sendPendingAction?.message).to(contain("null"))
        }
    }
}

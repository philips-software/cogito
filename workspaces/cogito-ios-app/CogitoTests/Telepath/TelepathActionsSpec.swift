import Quick
import Nimble
import SwiftyJSON
@testable import Cogito

class TelepathActionsSpec: QuickSpec {
    override func spec() {
        var store: RecordingStore!

        beforeEach {
            store = RecordingStore()
        }

        describe("connection") {
            let connectUrl = URL(
                string: "https://cogito.example.com/telepath/connect#I=1234&E=abcd&A=QQ"
            )!
            let identity = Identity.example

            it("connects to a channel") {
                store.dispatch(TelepathActions.Connect(url: connectUrl, for: identity))
                expect(store.actions.last as? TelepathActions.ConnectFulfilled)
                    .toEventuallyNot(beNil())
            }

            it("reports an error when connecting to a channel fails") {
                store.dispatch(TelepathActions.Connect(url: URL(string: "http://invalid")!, for: identity))
                let rejected = store.actions.last as? TelepathActions.ConnectRejected
                expect(rejected).toNot(beNil())
            }
        }

        describe("sending and receiving") {
            var channel: TelepathChannelSpy!
            let identity = Identity.example

            beforeEach {
                channel = TelepathChannelSpy()
                store.state = appState(telepath: TelepathState(channels: [channel: identity.identifier]))
            }

            it("receives messages") {
                let message = "a message"
                channel.receiveMessage = message
                store.dispatch(TelepathActions.Receive())
                let fulfilled = store.actions.last as? TelepathActions.ReceiveFulfilled
                expect(fulfilled?.message) == message
            }

            it("reports errors while receiving") {
                let error = ExampleError(message: "an error")
                channel.receiveError = error
                store.dispatch(TelepathActions.Receive())
                let rejected = store.actions.last as? TelepathActions.ReceiveRejected
                expect(rejected?.error as? ExampleError) == error
            }

            it("sends messages") {
                let message = "a message"
                store.dispatch(TelepathActions.Send(message: message, on: channel))
                expect(channel.sentMessage) == message
            }

            it("reports sending success") {
                store.dispatch(TelepathActions.Send(message: "", on: channel))
                let fulfilled = store.actions.last as? TelepathActions.SendFulfilled
                expect(fulfilled).toNot(beNil())
            }

            it("reports errors while sending") {
                let error = ExampleError(message: "an error")
                channel.sendError = error
                store.dispatch(TelepathActions.Send(message: "", on: channel))
                let rejected = store.actions.last as? TelepathActions.SendRejected
                expect(rejected?.error as? ExampleError) == error
            }
        }

        describe("sending JSON-RPC") {
            let id = JsonRpcId(42)
            let channel = TelepathChannelSpy()

            enum TestError: Int, TelepathError {
                case someError = 123
                var code: Int { return self.rawValue }
                var message: String { return "an error message" }
            }

            it("encodes string responses") {
                let result = "foo"

                store.dispatch(TelepathActions.Send(id: id, result: result, on: channel))

                let pending = store.firstAction(ofType: TelepathActions.SendPending.self)!
                expect(JSON(parseJSON: pending.message)) == JSON([
                    "jsonrpc": "2.0",
                    "id": id.object,
                    "result": result
                ])
            }

            it("encodes dictionary responses") {
                let result = [ "foo": 1 ]

                store.dispatch(TelepathActions.Send(id: id, result: result, on: channel))

                let pending = store.firstAction(ofType: TelepathActions.SendPending.self)!
                expect(JSON(parseJSON: pending.message)) == JSON([
                    "jsonrpc": "2.0",
                    "id": id.object,
                    "result": result
                ])
            }

            it("encodes array responses") {
                let result = [ "foo", "bar" ]

                store.dispatch(TelepathActions.Send(id: id, result: result, on: channel))

                let pending = store.firstAction(ofType: TelepathActions.SendPending.self)!
                expect(JSON(parseJSON: pending.message)) == JSON([
                    "jsonrpc": "2.0",
                    "id": id.object,
                    "result": result
                ])
            }

            it ("encodes data responses") {
                let result = "some data".data(using: .utf8)!

                store.dispatch(TelepathActions.Send(id: id, result: result, on: channel))

                let pending = store.firstAction(ofType: TelepathActions.SendPending.self)!

                expect(JSON(parseJSON: pending.message)) == JSON([
                    "jsonrpc": "2.0",
                    "id": id.object,
                    "result": "0x" + result.hexEncodedString()
                ])
            }

            it("encodes errors") {
                let action = TelepathActions.Send(
                    id: id,
                    error: TestError.someError,
                    on: channel
                )

                store.dispatch(action)

                let pending = store.firstAction(ofType: TelepathActions.SendPending.self)!

                expect(JSON(parseJSON: pending.message)) == JSON([
                    "jsonrpc": "2.0",
                    "id": id.object,
                    "error": [
                        "code": TestError.someError.code,
                        "message": TestError.someError.message
                    ]
                ])
            }
        }
    }
}

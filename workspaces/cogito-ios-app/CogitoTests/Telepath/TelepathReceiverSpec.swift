import Quick
import Nimble
import ReSwift
import Telepath
@testable import Cogito

class TelepathReceiverSpec: QuickSpec {
    override func spec() {
        var receiver: TelepathReceiver!
        var store: RecordingStore!
        var telepathChannelSpy: TelepathChannelSpy!
        let identity = Identity.example

        beforeEach {
            store = RecordingStore()
            telepathChannelSpy = TelepathChannelSpy()
            telepathChannelSpy.receiveMessage = "message"
            store.state = appState(telepath: TelepathState(channels: [telepathChannelSpy: identity.identifier]))
            receiver = TelepathReceiver(store: store, pollInterval: 0)
        }

        describe("subscribe/unsubscribe") {
            var newStateReceived = false

            beforeEach {
                newStateReceived = false
                receiver.onNewState = { _ in return { _ in
                    newStateReceived = true
                }}
            }

            it("subscribes to changes to the telepath channel") {
                receiver.start()
                store.dispatch(TracerAction())
                expect(newStateReceived).to(beTrue())
            }

            it("unsubscribes") {
                receiver.stop()
                store.dispatch(TracerAction())
                expect(newStateReceived).to(beFalse())
            }
        }

        it("continuously polls for new messages") {
            receiver.newState(state: [telepathChannelSpy: identity.identifier])
            expect(store.actions.count).toEventually(beGreaterThan(5))
        }

        it("has a sensible polling interval") {
            expect(TelepathReceiver(store: store).pollInterval) == 1.0
        }
    }
}

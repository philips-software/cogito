//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwift
import Telepath

class TelepathReceiverSpec: QuickSpec {
    override func spec() {
        var receiver: TelepathReceiver!
        var store: StoreSpy!

        beforeEach {
            store = StoreSpy()
            receiver = TelepathReceiver(store: store, pollInterval: 0)
        }

        it("subscribes to changes to the telepath channel") {
            receiver.start()
            expect(store.latestSubscriber) === receiver
        }

        it("unsubscribes") {
            receiver.stop()
            expect(store.latestUnsubscriber) === receiver
        }

        it("continuously polls for new messages") {
            receiver.newState(state: TelepathChannelSpy())
            expect(store.actions.count).toEventually(beGreaterThan(5))
        }

        it("has a sensible polling interval") {
            expect(TelepathReceiver(store: store).pollInterval) == 0.5
        }
    }
}

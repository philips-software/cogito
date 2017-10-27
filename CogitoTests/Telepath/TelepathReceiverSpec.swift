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
            receiver = TelepathReceiver(store: store)
        }

        it("subscribes to changes to the telepath channel") {
            receiver.start()
            expect(store.latestSubscriber) === receiver
        }

        it("unsubscribes") {
            receiver.stop()
            expect(store.latestUnsubscriber) === receiver
        }
    }
}

class StoreSpy: Store<AppState> {
    var latestSubscriber: AnyStoreSubscriber?
    var latestUnsubscriber: AnyStoreSubscriber?

    convenience init() {
        self.init(reducer: { _, _ in return initialAppState }, state: nil)
    }

    override func subscribe<SelectedState, S>(
        _ subscriber: S, transform:((Subscription<AppState>) -> Subscription<SelectedState>)?
    ) where SelectedState == S.StoreSubscriberStateType, S: StoreSubscriber {
        latestSubscriber = subscriber
        super.subscribe(subscriber, transform: transform)
    }

    override func unsubscribe(_ subscriber: AnyStoreSubscriber) {
        latestUnsubscriber = subscriber
    }
}

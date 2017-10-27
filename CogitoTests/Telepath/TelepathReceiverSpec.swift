//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwift
import Telepath

class TelepathReceiverSpec: QuickSpec {
    override func spec() {
        var receiver: TelepathReceiver!
        var store: StoreSpy!
        var channel: TelepathChannelSpy!

        beforeEach {
            store = StoreSpy()
            channel = TelepathChannelSpy()
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

        it("receives messages") {
            let message = "a message"
            channel.receiveMessage = message
            receiver.newState(state: channel)
            let latestMessage: () -> String? = {
                let latestReceive = store.actions.last as? ReceiveFulfilled
                return  latestReceive?.message
            }
            expect(latestMessage()).toEventually(equal(message))
        }

        it("continuously polls for new messages") {
            channel.receiveMessage = "a message"
            receiver.newState(state: channel)
            expect(store.actions.count).toEventually(beGreaterThan(5))
        }

        it("reports errors while receiving") {
            let error = ExampleError(message: "an error")
            channel.receiveError = error
            receiver.newState(state: channel)
            let latestError: () -> Error? = {
                let latestReject = store.actions.last as? ReceiveRejected
                return latestReject?.error
            }
            expect(latestError() as? ExampleError).toEventually(equal(error))
        }
    }
}

private typealias ReceiveFulfilled = TelepathActions.ReceiveFulfilled
private typealias ReceiveRejected = TelepathActions.ReceiveRejected

class StoreSpy: Store<AppState> {
    var latestSubscriber: AnyStoreSubscriber?
    var latestUnsubscriber: AnyStoreSubscriber?
    var actions = [Action]()

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

    override func dispatch(_ action: Action) {
        actions.append(action)
    }
}

class TelepathChannelSpy: TelepathChannelType {
    var receiveMessage: String?
    var receiveError: Error?

    func receive(completion: @escaping (String?, Error?) -> Void) {
        completion(receiveMessage, receiveError)
    }
}

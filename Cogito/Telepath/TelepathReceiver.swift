//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class TelepathReceiver: StoreSubscriber {
    let store: Store<AppState>
    let pollInterval: TimeInterval
    var timer: Timer?

    init(store: Store<AppState>, pollInterval: TimeInterval = 1) {
        self.store = store
        self.pollInterval = pollInterval
    }

    deinit {
        timer?.invalidate()
    }

    func start() {
        store.subscribe(self) { subscription in
            subscription.select { state in
                state.telepath.channel
            }
        }
    }

    func stop() {
        store.unsubscribe(self)
    }

    func newState(state channel: TelepathChannelType?) {
        timer?.invalidate()
        if let channel = channel {
            timer = Timer.scheduledTimer(withTimeInterval: pollInterval, repeats: true) { [weak self] _ in
                self?.poll(channel: channel)
            }
        }
    }

    private func poll(channel: TelepathChannelType) {
        channel.receive { [weak self] message, error in
            if let error = error {
                let action = TelepathActions.ReceiveRejected(error: error)
                self?.store.dispatch(action)
            } else if let message = message {
                let action = TelepathActions.ReceiveFulfilled(message: message)
                self?.store.dispatch(action)
            }
        }
    }
}

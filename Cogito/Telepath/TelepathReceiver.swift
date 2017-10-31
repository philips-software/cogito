//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class TelepathReceiver: StoreSubscriber {
    let store: Store<AppState>
    let pollInterval: TimeInterval
    var timer: Timer?

    init(store: Store<AppState>, pollInterval: TimeInterval = 0.5) {
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
        if channel != nil {
            timer = Timer.scheduledTimer(withTimeInterval: pollInterval, repeats: true) { [weak self] _ in
                self?.store.dispatch(TelepathActions.Receive())
            }
        }
    }
}

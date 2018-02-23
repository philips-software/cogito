//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class TelepathReceiver: StoreSubscriber {
    let store: Store<AppState>
    let pollInterval: TimeInterval
    var timers: [TelepathChannel:Timer] = [:]

    init(store: Store<AppState>, pollInterval: TimeInterval = 0.5) {
        self.store = store
        self.pollInterval = pollInterval
    }

    deinit {
        for timer in timers.values {
            timer.invalidate()
        }
    }

    func start() {
        store.subscribe(self) { subscription in
            subscription.select { state in
                state.telepath.channels
            }
        }
    }

    func stop() {
        store.unsubscribe(self)
    }

    func newState(state channels: [TelepathChannel:Identity]?) {
        for timer in timers.values {
            timer.invalidate()
        }
        timers = [:]

        guard let channels = channels else { return }

        for channel in channels.keys {
            let timer = Timer.scheduledTimer(withTimeInterval: pollInterval, repeats: true) { [weak self] _ in
                self?.store.dispatch(TelepathActions.Receive())
            }
            timers[channel] = timer
        }
    }
}

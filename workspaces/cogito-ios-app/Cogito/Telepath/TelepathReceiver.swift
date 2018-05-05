// Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class TelepathReceiver: StoreSubscriber {
    let store: Store<AppState>
    let pollInterval: TimeInterval
//    var timers: [TelepathChannel:Timer] = [:]
    var timer: Timer?
    var onNewState = recreatePollingTimers

    init(store: Store<AppState>, pollInterval: TimeInterval = 1.0) {
        self.store = store
        self.pollInterval = pollInterval
    }

    deinit {
//        for timer in timers.values {
        self.timer?.invalidate()
//        }
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

    func newState(state channels: [TelepathChannel:UUID]?) {
        self.onNewState(self)(channels)
    }

    func recreatePollingTimers(channels: [TelepathChannel:UUID]?) {
//        for timer in timers.values {
        self.timer?.invalidate()
//        }
//        timers = [:]

//        guard let channels = channels else { return }

        self.store.dispatch(TelepathActions.Invalidate())

        self.timer = Timer.scheduledTimer(withTimeInterval: pollInterval, repeats: true) { [weak self] _ in
            self?.store.dispatch(TelepathActions.Receive())
        }

//        for channel in channels.keys {
//            let timer = Timer.scheduledTimer(withTimeInterval: pollInterval, repeats: true) { [weak self] _ in
//                self?.store.dispatch(TelepathActions.Receive())
//            }
//            timers[channel] = timer
//        }
    }
}

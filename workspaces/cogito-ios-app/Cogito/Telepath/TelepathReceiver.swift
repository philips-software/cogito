import ReSwift

class TelepathReceiver: StoreSubscriber {
    let store: Store<AppState>
    let pollInterval: TimeInterval
    var timer: Timer?
    var onNewState = recreatePollingTimers

    init(store: Store<AppState>, pollInterval: TimeInterval = 1.0) {
        self.store = store
        self.pollInterval = pollInterval
    }

    deinit {
        self.timer?.invalidate()
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
        self.timer?.invalidate()

        self.store.dispatch(TelepathActions.Invalidate())

        self.timer = Timer.scheduledTimer(withTimeInterval: pollInterval, repeats: true) { [weak self] _ in
            self?.store.dispatch(TelepathActions.Receive())
        }
    }
}

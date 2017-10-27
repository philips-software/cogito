//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class TelepathReceiver: StoreSubscriber {
    let store: Store<AppState>

    init(store: Store<AppState>) {
        self.store = store
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

    func newState(state: TelepathChannel?) {

    }
}

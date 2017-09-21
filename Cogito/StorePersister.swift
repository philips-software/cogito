//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class StorePersister: StoreSubscriber {
    let store: Store<AppState>
    let stateUrl: URL

    init(store: Store<AppState>, persistAt stateUrl: URL) throws {
        self.store = store
        self.stateUrl = stateUrl
        if FileManager.default.fileExists(atPath: stateUrl.path) {
            let decoder = JSONDecoder()
            let encodedState = try Data(contentsOf: stateUrl)
            store.state = try decoder.decode(AppState.self, from: encodedState)
        }
    }

    func start() {
        store.subscribe(self)
    }

    func stop() {
        store.unsubscribe(self)
    }

    func newState(state: AppState) {
        do {
            let encoder = JSONEncoder()
            let encodedState = try encoder.encode(store.state)
            try encodedState.write(to: stateUrl, options: .atomicWrite)
            print("Saved new state to disk (\(stateUrl.path))")
        } catch let e {
            print("Failed to write state to disk: \(e).")
        }
    }
}

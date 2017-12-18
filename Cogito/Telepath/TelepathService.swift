//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class TelepathService: StoreSubscriber {
    let store: Store<AppState>
    let method: String

    init(store: Store<AppState>, method: String) {
        self.store = store
        self.method = method
    }

    func start() {
        store.subscribe(self) { subscription in
            subscription.select { state in
                state.telepath.receivedMessages
            }
        }
    }

    func stop() {
        store.unsubscribe(self)
    }

    func newState(state incomingMessages: [String]) {
        if let message = incomingMessages.first, message.isRequest(method: method) {
            store.dispatch(TelepathActions.ReceivedMessageHandled())
            onMessage(message)
        }
    }

    func onMessage(_ message: String) { }
}

private extension String {
    func isRequest(method: String) -> Bool {
        let request = try? JSONDecoder().decode(JSONRequest.self, from: self)
        return request?.method == method
    }
}

private struct JSONRequest: Codable {
    let method: String
    enum CodingKeys: String, CodingKey {
        case method
    }
}

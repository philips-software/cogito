//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class TransactionSigningService: StoreSubscriber {
    let store: Store<AppState>

    init(store: Store<AppState>) {
        self.store = store
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
        if incomingMessages.first?.isSignRequest == true {
            store.dispatch(TelepathActions.ReceivedMessageHandled())
            store.dispatch(TransactionSigningActions.Sign())
        }
    }
}

private extension String {
    var isSignRequest: Bool {
        let request = try? JSONDecoder().decode(JSONRequest.self, from: self)
        return request?.method == "signTransaction"
    }
}

private struct JSONRequest: Codable {
    let method: String
}

private extension JSONDecoder {
    func decode<T>(_ type: T.Type, from string: String) throws -> T where T: Decodable {
        let data = string.data(using: .utf8)!
        return try decode(type, from: data)
    }
}

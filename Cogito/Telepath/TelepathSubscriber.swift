//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

class TelepathSubscriber: StoreSubscriber {
    let store: Store<AppState>
    var services: [TelepathService] = []

    init(store: Store<AppState>) {
        self.store = store
    }

    func addService(_ service: TelepathService) {
        services.append(service)
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
        if let message = incomingMessages.first, let request = JsonRpcRequest(parse: message) {
            for service in services {
                service.onRequest(request)
            }
        }
        store.dispatch(TelepathActions.ReceivedMessageHandled())
    }
}

protocol TelepathService {
    func onRequest(_ request: JsonRpcRequest)
}

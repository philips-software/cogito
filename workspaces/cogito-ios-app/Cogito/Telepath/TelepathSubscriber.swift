import ReSwift

class TelepathSubscriber: StoreSubscriber {
    let store: Store<AppState>
    var services: [TelepathService] = []
    var onNewState = dispatchIncomingMessages

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

    func newState(state incomingMessages: [TelepathMessage]) {
        onNewState(self)(incomingMessages)
    }

    func dispatchIncomingMessages(_ incomingMessages: [TelepathMessage]) {
        guard let message = incomingMessages.first else {
            return
        }
        store.dispatch(TelepathActions.ReceivedMessageHandled())
        if let request = JsonRpcRequest(parse: message.message) {
            for service in services {
                service.onRequest(request, on: message.channel)
            }
        }
    }
}

protocol TelepathService {
    func onRequest(_ request: JsonRpcRequest, on channel: TelepathChannel)
}

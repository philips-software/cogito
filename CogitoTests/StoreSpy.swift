import ReSwift

class StoreSpy: Store<AppState> {
    var latestSubscriber: AnyStoreSubscriber?
    var latestUnsubscriber: AnyStoreSubscriber?
    var actions = [Action]()

    convenience init() {
        self.init(reducer: { _, _ in return initialAppState }, state: nil)
    }

    override func subscribe<SelectedState, S>(
        _ subscriber: S, transform:((Subscription<AppState>) -> Subscription<SelectedState>)?
    ) where SelectedState == S.StoreSubscriberStateType, S: StoreSubscriber {
        latestSubscriber = subscriber
        super.subscribe(subscriber, transform: transform)
    }

    override func unsubscribe(_ subscriber: AnyStoreSubscriber) {
        latestUnsubscriber = subscriber
    }

    override func dispatch(_ action: Action) {
        actions.append(action)
        }
}

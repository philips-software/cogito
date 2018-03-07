import ReSwift

class StoreSpy: Store<AppState> {
    var actions = [Action]()

    convenience init() {
        self.init(reducer: { _, _ in return initialAppState }, state: nil)
    }

    override func dispatch(_ action: Action) {
        actions.append(action)
    }
}

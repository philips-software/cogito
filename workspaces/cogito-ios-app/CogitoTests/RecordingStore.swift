import ReSwift
import ReSwiftThunk
@testable import Cogito

class RecordingStore: Store<AppState> {
    var actions = [Action]()

    convenience init(state: AppState = initialAppState) {
        let reducer: Reducer<AppState> = { _, currentState in
            return currentState ?? state
        }
        self.init(reducer: reducer, state: nil, middleware: [createThunksMiddleware()])
    }

    override func dispatch(_ action: Action) {
        self.record(action)
        super.dispatch(action)
    }

    func record(_ action: Action) {
        if (action as? Thunk<AppState>) == nil && (action as? ReSwiftInit) == nil {
            actions.append(action)
        }
    }
}

extension RecordingStore {
    func firstAction <T> (ofType: T.Type) -> T? {
        return actions.compactMap { $0 as? T }.first
    }

    func lastAction <T> (ofType: T.Type) -> T? {
        return actions.compactMap { $0 as? T }.last
    }
}

struct TracerAction: Action {}

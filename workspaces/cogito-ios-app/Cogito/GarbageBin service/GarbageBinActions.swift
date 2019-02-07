import ReSwift
import Geth

struct GarbageBinActions {
    struct Add: Action {
        let key: String
        let value: String
    }

    struct Delete: Action {
        let key: String
    }
}

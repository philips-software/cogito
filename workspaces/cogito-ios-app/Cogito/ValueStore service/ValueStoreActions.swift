import ReSwift

struct ValueStoreActions {
    struct Add: Action {
        let key: String
        let value: String
    }

    struct Delete: Action {
        let key: String
    }
}

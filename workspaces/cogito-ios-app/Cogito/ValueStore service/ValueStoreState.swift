import ReSwift

struct ValueStoreState: Codable {
    var store: [String: String]

    init(store: [String: String]) {
        self.store = store
    }

    func valueForKey(key: String) -> String? {
        return self.store[key]
    }
}

extension ValueStoreState: Equatable {
    static func == (lhs: ValueStoreState, rhs: ValueStoreState) -> Bool {
        return lhs.store == rhs.store
    }
}

let initialValueStoreState = ValueStoreState(store: [:])

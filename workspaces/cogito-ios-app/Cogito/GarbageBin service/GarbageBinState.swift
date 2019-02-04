import ReSwift

struct GarbageBinState: Codable {
    var bin: [String: String]

    init(bin: [String: String]) {
        self.bin = bin
    }

    func valueForKey(key: String) -> String? {
        return self.bin[key]
    }
}

extension GarbageBinState: Equatable {
    static func == (lhs: GarbageBinState, rhs: GarbageBinState) -> Bool {
        return lhs.bin == rhs.bin
    }
}

let initialGarbageBinState = GarbageBinState(bin: [:])

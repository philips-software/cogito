struct SyncProgress {
    let start: Int
    let current: Int
    let total: Int

    var fractionComplete: Float {
        return Float(current - start) / Float(total - start)
    }
}

extension SyncProgress: Equatable {
    static func == (lhs: SyncProgress, rhs: SyncProgress) -> Bool {
        return lhs.start == rhs.start && lhs.current == rhs.current && lhs.total == rhs.total
    }
}

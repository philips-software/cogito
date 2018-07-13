import ReSwift

struct PeersUpdated: Action {
    let count: Int
}

struct SyncProgressUpdated: Action {
    let progress: SyncProgress?
}

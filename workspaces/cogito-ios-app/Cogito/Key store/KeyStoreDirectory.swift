import Foundation

struct KeyStoreDirectory {
    let url: URL
}

extension KeyStoreDirectory {
    init(name: String) {
        let base = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        url = base.appendingPathComponent(name)
    }
}

extension KeyStoreDirectory {
    func delete() throws {
        if FileManager.default.fileExists(atPath: url.path) {
            try FileManager.default.removeItem(at: url)
        }
    }
}

extension KeyStoreDirectory {
    var path: String {
        return url.path
    }
}

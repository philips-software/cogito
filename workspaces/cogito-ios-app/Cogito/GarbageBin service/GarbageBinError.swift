enum GarbageBinError: Int, TelepathError {
    case keyNotFound = 3100
    case valueNotFound
    case noValueForKey
    case noKeyInStore

    var code: Int { return self.rawValue }

    var message: String {
        switch self {
        case .keyNotFound: return "no key param found in the request"
        case .valueNotFound: return "no value param found in the request"
        case .noValueForKey: return "no value found for key"
        case .noKeyInStore: return "key not found in the bin"
        }
    }
}

import Foundation

func parseUrlParameters(_ query: String) -> [String: String] {
    var result: [String: String] = [:]
    for keyValuePair in query.split(separator: "&") {
        guard let (key, value) = parseKeyValuePair(keyValuePair) else {
            continue
        }
        result[key] = value
    }
    return result
}

private func parseKeyValuePair(_ pair: Substring) -> (key: String, value: String)? {
    let components = pair.split(separator: "=", maxSplits: 1)
    guard components.count == 2 else {
        return nil
    }
    guard let key = components.first?.removingPercentEncoding else {
        return nil
    }
    guard let value = components.last?.removingPercentEncoding else {
        return nil
    }
    return (key, value)
}

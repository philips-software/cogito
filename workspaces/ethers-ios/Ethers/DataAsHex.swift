extension Data {
    var asHex: String {
        return reduce("0x") { $0 + String(format: "%02x", $1) }
    }
}


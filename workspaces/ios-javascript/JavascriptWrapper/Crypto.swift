import JavaScriptCore

public extension JSContext {
    public func addCrypto() -> JSContext {
        let crypto = JSValue(newObjectIn: self)!
        crypto.setValue(randomBytes, forProperty: "randomBytes")
        globalObject.setValue(crypto, forProperty: "crypto")
        return load(bundle: Bundle(for: Crypto.self), filename: "crypto")
    }
    
    private class Crypto {}
}

private let randomBytes: @convention(block) (Int) -> [UInt8] = { amount in
    var buffer = Data(count: amount)
    _ = buffer.withUnsafeMutableBytes {
        assert(SecRandomCopyBytes(kSecRandomDefault, amount, $0) == errSecSuccess)
    }
    return Array(buffer)
}

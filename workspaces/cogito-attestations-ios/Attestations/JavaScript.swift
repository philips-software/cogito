import JavaScriptCore
import Security

class Javascript {
    static let context = JSContext()!
        .setExceptionHandler(onException)
        .addCrypto()
        .load(filename: "crypto")
        .load(filename: "polyfill.min")
        .load(filename: "cogito-attestations.min")
}

private extension JSContext {
    func load(filename: String) -> JSContext {
        let bundle = Bundle(for: Javascript.self)
        let path = bundle.path(forResource: filename, ofType: "js")!
        let script = try! String(contentsOfFile: path)
        evaluateScript(script)
        return self
    }

    func setExceptionHandler(_ handler: @escaping (JSContext?, JSValue?) -> Void) -> JSContext {
        exceptionHandler = handler
        return self
    }

    func addCrypto() -> JSContext {
        let crypto = JSValue(newObjectIn: self)!
        crypto.setValue(randomBytes, forProperty: "randomBytes")
        globalObject.setValue(crypto, forProperty: "crypto")
        return self
    }
}

let randomBytes: @convention(block) (Int) -> [UInt8] = { amount in
    var buffer = Data(count: amount)
    _ = buffer.withUnsafeMutableBytes {
        assert(SecRandomCopyBytes(kSecRandomDefault, amount, $0) == errSecSuccess)
    }
    return Array(buffer)
}

private func onException(context: JSContext?, value: JSValue?) {
    let message = value?.toString() ?? "unknown error"
    assertionFailure("JavaScript error: \(message)")
}

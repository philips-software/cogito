import JavaScriptCore

class Javascript {
    static let context = JSContext()!
        .setExceptionHandler(onException)
        .addEthers()
}

extension JSContext {
    fileprivate func setExceptionHandler(_ handler: @escaping ExceptionHandler) -> JSContext {
        exceptionHandler = handler
        return self
    }

    func load(filename: String) -> JSContext {
        let bundle = Bundle(for: Javascript.self)
        let path = bundle.path(forResource: filename, ofType: "js")!
        let script = try! String(contentsOfFile: path)
        evaluateScript(script)
        return self
    }
}

private func onException(context: JSContext?, value: JSValue?) {
    let message = value?.toString() ?? "unknown error"
    assertionFailure("Javascript error: \(message)")
}

private typealias ExceptionHandler = (JSContext?, JSValue?) -> Void

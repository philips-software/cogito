import JavaScriptCore

public extension JSContext {
    public func setExceptionHandler() -> JSContext {
        return setExceptionHandler(onException)
    }

    public func setExceptionHandler(_ handler: @escaping ExceptionHandler) -> JSContext {
        exceptionHandler = handler
        return self
    }

    public typealias ExceptionHandler = (JSContext?, JSValue?) -> Void
    
    private func onException(context: JSContext?, value: JSValue?) {
        let message = value?.toString() ?? "unknown error"
        assertionFailure("Javascript error: \(message)")
    }
}

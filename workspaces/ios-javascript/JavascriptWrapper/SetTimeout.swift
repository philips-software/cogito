import JavaScriptCore

public extension JSContext {
    public func addSetTimeout() -> JSContext {
        self.globalObject.setValue(setTimeout, forProperty: "setTimeout")
        return self
    }
}

fileprivate let setTimeout: @convention(block) (JSValue?, JSValue?) -> Void = { callback, milliseconds in
    var delay: Double = 0
    if let milliseconds = milliseconds, milliseconds.isNumber {
        delay = milliseconds.toDouble() / 1000
    }
    DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
        callback?.call(withArguments: [])
    }
}

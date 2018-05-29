import JavaScriptCore

extension JSContext {
    func addConsole() -> JSContext {
        let console = JSValue(newObjectIn: self)!
        console.setValue(log, forProperty: "log")
        globalObject.setValue(console, forProperty: "console")
        return self
    }
}

private let log: @convention(block) (String) -> Void = { message in
    print(message)
}

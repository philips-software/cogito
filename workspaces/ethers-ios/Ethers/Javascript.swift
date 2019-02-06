import JavaScriptCore

class Javascript {
    static let context = JSContext()!
        .setExceptionHandler()
        .addSetTimeout()
        .addEthers()
}

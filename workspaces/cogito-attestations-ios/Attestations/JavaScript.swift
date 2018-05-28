import JavaScriptCore

class Javascript {
    static let context = JSContext()!.load(filename: "cogito-attestations.min")
}

private extension JSContext {
    func load(filename: String) -> JSContext {
        let bundle = Bundle(for: Javascript.self)
        let path = bundle.path(forResource: filename, ofType: "js")!
        let script = try! String(contentsOfFile: path)
        evaluateScript(script)
        return self
    }
}


import JavaScriptCore

public extension JSContext {
    public func load(bundle: Bundle, filename: String) -> JSContext {
        let path = bundle.path(forResource: filename, ofType: "js")!
        return load(path: path)
    }
    
    public func load(path: String) -> JSContext {
        let script = try! String(contentsOfFile: path)
        evaluateScript(script)
        return self
    }
}

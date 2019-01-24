import JavaScriptCore

extension JSValue {
    func invokeAsync(_ name: String, withArguments arguments: [Any], callback: @escaping AsyncCallback) {
        let onSuccess: @convention(block) (JSValue?) -> Void = { result in
            callback(nil, result!)
        }
        let onFailure: @convention(block) (JSValue?) -> Void = { error in
            let message = error!.forProperty("message")!.toString()!
            callback(JavascriptError(message: message), nil)
        }
        self.invokeMethod(name, withArguments: arguments)!
            .invokeMethod("then", withArguments: [unsafeBitCast(onSuccess, to: AnyObject.self)])
            .invokeMethod("catch", withArguments: [unsafeBitCast(onFailure, to: AnyObject.self)])
    }
    
    typealias AsyncCallback = (JavascriptError?, JSValue?) -> Void
    
    struct JavascriptError {
        let message: String
    }
}

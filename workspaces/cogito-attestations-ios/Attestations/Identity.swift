import JavaScriptCore

class Identity {
    let javascriptValue: JSValue

    init() {
        let context = Javascript.context
        let attestations = context.objectForKeyedSubscript("cogito-attestations")!
        javascriptValue = attestations.invokeMethod("Identity", withArguments: [])!
    }

    var address: String {
        return javascriptValue.forProperty("address").toString()!
    }
}

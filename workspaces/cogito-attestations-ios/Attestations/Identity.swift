import JavaScriptCore

public class Identity {
    let javascriptValue: JSValue

    public init() {
        let context = Javascript.context
        let attestations = context.objectForKeyedSubscript("cogito-attestations")!
        javascriptValue = attestations.invokeMethod("Identity", withArguments: [])!
    }

    public var address: String {
        return javascriptValue.forProperty("address").toString()!
    }
}

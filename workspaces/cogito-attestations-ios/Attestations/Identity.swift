import JavaScriptCore

public class Identity {
    let javascriptValue: JSValue

    public init() {
        let identity = Javascript.cogitoAttestations.forProperty("Identity")!
        javascriptValue = identity.construct(withArguments: [])!
    }

    public var address: String {
        return javascriptValue.forProperty("address").toString()!
    }
}

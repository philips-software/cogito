import JavaScriptCore

public class Identity {
    let javascriptValue: JSValue

    public init() {
        let global = Javascript.context.globalObject!
        let attestations = global.forProperty("cogitoAttestations")!
        let identity = attestations.forProperty("Identity")!
        javascriptValue = identity.construct(withArguments: [])!
    }

    public var address: String {
        return javascriptValue.forProperty("address").toString()!
    }
}

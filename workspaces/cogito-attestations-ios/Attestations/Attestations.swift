import JavaScriptCore

public func issue(attribute: String, issuer: Identity) -> ProtoAttestation {
    let global = Javascript.context.globalObject!
    let attestations = global.forProperty("cogitoAttestations")!
    let result = attestations.invokeMethod("issue", withArguments: [attribute, issuer.javascriptValue])!
    return ProtoAttestation(javascriptValue: result)
}

public class ProtoAttestation {
    let javascriptValue: JSValue

    init(javascriptValue: JSValue) {
        self.javascriptValue = javascriptValue
    }

    public var issuer: String {
        return javascriptValue.forProperty("issuer").toString()
    }

    public var attribute: String {
        return javascriptValue.forProperty("attribute").toString()
    }

    public var attestationKey: String {
        return javascriptValue.forProperty("attestationKey").toString()
    }

    public var issuingSignature: String {
        return javascriptValue.forProperty("issuingSignature").toString()
    }
}

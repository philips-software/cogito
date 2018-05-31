import JavaScriptCore

public func issue(attribute: String, issuer: Identity) -> ProtoAttestation {
    let issue = Javascript.cogitoAttestations.forProperty("issue")!
    let result = issue.call(withArguments: [attribute, issuer.javascriptValue])!
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

extension ProtoAttestation: Equatable {
    public static func == (lhs: ProtoAttestation, rhs: ProtoAttestation) -> Bool {
        return
            lhs.issuer == rhs.issuer &&
            lhs.attribute == rhs.attribute &&
            lhs.attestationKey == rhs.attestationKey &&
            lhs.issuingSignature == rhs.issuingSignature
    }
}

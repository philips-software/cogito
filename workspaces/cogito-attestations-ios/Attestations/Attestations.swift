import JavaScriptCore

public func issue(attribute: String, issuer: Identity) -> ProtoAttestation {
    let issue = Javascript.cogitoAttestations.forProperty("issue")!
    let result = issue.call(withArguments: [attribute, issuer.javascriptValue])!
    return ProtoAttestation(javascriptValue: result)
}

public func accept(protoAttestation: ProtoAttestation, subject: Identity) -> Attestation {
    let accept = Javascript.cogitoAttestations.forProperty("accept")!
    let result = accept.call(withArguments: [protoAttestation.javascriptValue, subject.javascriptValue])!
    return Attestation(javascriptValue: result)
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

public class Attestation {
    let javascriptValue: JSValue

    init(javascriptValue: JSValue) {
        self.javascriptValue = javascriptValue
    }

    public var issuer: String {
        return javascriptValue.forProperty("issuer").toString()
    }

    public var subject: String {
        return javascriptValue.forProperty("subject").toString()
    }

    public var attribute: String {
        return javascriptValue.forProperty("attribute").toString()
    }

    public var issuingSignature: String {
        return javascriptValue.forProperty("issuingSignature").toString()
    }

    public var attestationSignature: String {
        return javascriptValue.forProperty("attestationSignature").toString()
    }

    public var acceptingSignature: String {
        return javascriptValue.forProperty("acceptingSignature").toString()
    }
}

extension Attestation: Equatable {
    public static func == (lhs: Attestation, rhs: Attestation) -> Bool {
        return
            lhs.issuer == rhs.issuer &&
            lhs.attribute == rhs.attribute &&
            lhs.issuingSignature == rhs.issuingSignature &&
            lhs.attestationSignature == rhs.attestationSignature &&
            lhs.acceptingSignature == rhs.acceptingSignature
    }
}

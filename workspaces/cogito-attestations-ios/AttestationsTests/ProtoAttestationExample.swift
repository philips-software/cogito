import Attestations

extension ProtoAttestation {
    static var example: ProtoAttestation {
        return issue(attribute: "example:attribute", issuer: Identity())
    }
}

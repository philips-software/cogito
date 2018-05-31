import Attestations

extension Attestation {
    static var example: Attestation {
        let protoAttestation = ProtoAttestation.example
        return accept(protoAttestation: protoAttestation, subject: Identity())
    }
}

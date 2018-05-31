import Quick
import Nimble
import Attestations

class AttestationsSpec: QuickSpec {
    override func spec() {
        it("can create new identities") {
            let identity1 = Identity()
            let identity2 = Identity()
            expect(identity1.address) != identity2.address
        }

        it("can issue new attestations") {
            let issuer = Identity()
            let attribute = "email:bob@example.com"
            let protoAttestation = issue(attribute: attribute, issuer: issuer)
            expect(protoAttestation.issuer) == issuer.address
            expect(protoAttestation.attribute) == attribute
            expect(protoAttestation.attestationKey) != "undefined"
            expect(protoAttestation.issuingSignature) != "undefined"
        }

        it("can serialize a proto attestation") {
            let protoAttestation = ProtoAttestation.example
            let serialized = "\(protoAttestation)"
            expect(serialized) != "undefined"
        }

        it("can deserialize a proto attestation") {
            let protoAttestation = ProtoAttestation.example
            let deserialized = ProtoAttestation("\(protoAttestation)")
            expect(deserialized) == protoAttestation
        }

        it("can accept an attestation") {
            let subject = Identity()
            let protoAttestation = ProtoAttestation.example
            let attestation = accept(protoAttestation: protoAttestation, subject: subject)
            expect(attestation.issuer) == protoAttestation.issuer
            expect(attestation.subject) == subject.address
            expect(attestation.attribute) == protoAttestation.attribute
            expect(attestation.issuingSignature) != "undefined"
            expect(attestation.attestationSignature) != "undefined"
            expect(attestation.acceptingSignature) != "undefined"
        }

        it("can serialize an attestation") {
            let attestation = Attestation.example
            let serialized = "\(attestation)"
            expect(serialized) != "undefined"
        }

        it("can deserialize an attestation") {
            let attestation = Attestation.example
            let deserialized = Attestation("\(attestation)")
            expect(deserialized) == attestation
        }
    }
}

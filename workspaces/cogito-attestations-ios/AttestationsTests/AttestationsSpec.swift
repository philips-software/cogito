import Quick
import Nimble
import Attestations

class AttestationsSpec: QuickSpec {
    override func spec() {
        let issuer = Identity()
        let attribute = "email:bob@example.com"

        it("can create new identities") {
            let identity1 = Identity()
            let identity2 = Identity()
            expect(identity1.address) != identity2.address
        }

        it("can issue new attestations") {
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
    }
}

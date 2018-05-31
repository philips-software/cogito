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
    }
}

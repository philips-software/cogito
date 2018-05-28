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
    }
}

import Quick
import Nimble
import Ethers

class EthersSpec: QuickSpec {
    override func spec() {
        it("can create a random wallet") {
            expect(Wallet.createRandom()).toNot(beNil())
        }
    }
}

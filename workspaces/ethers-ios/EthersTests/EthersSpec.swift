import Quick
import Nimble
import Ethers

class EthersSpec: QuickSpec {
    override func spec() {
        it("can create a random wallet") {
            let wallet1 = Wallet.createRandom()
            let wallet2 = Wallet.createRandom()
            expect(wallet1.address) != wallet2.address
        }
    }
}

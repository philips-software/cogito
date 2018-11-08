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

        it("signs transactions") {
            let wallet = Wallet.createRandom()
            let transaction = Transaction()
            let signatureLength = 65 * 2
            waitUntil { done in
                wallet.sign(transaction) { signedTransaction in
                    expect(signedTransaction.count) > "0x".count + signatureLength
                    done()
                }
            }
        }
    }
}

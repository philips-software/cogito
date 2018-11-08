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

        context("signing transactions") {
            let transaction = Transaction()

            var wallet: Wallet!

            beforeEach {
                wallet = Wallet.createRandom()
            }

            func sign(_ transaction: Transaction) -> SignedTransaction {
                var result: SignedTransaction!
                waitUntil { done in wallet.sign(transaction) { result = $0; done() } }
                return result
            }

            it("produces a signed transaction") {
                let signatureLength = 65 * 2
                expect(sign(transaction).count) > "0x".count + signatureLength
            }

            it("is deterministic") {
                expect(sign(transaction)) == sign(transaction)
            }
        }
    }
}

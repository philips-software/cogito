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

            it("produces a signed transaction") {
                let signatureLength = 65 * 2
                waitUntil { done in
                    wallet.sign(transaction) { signedTransaction in
                        expect(signedTransaction.count) > "0x".count + signatureLength
                        done()
                    }
                }
            }

            it("is deterministic") {
                var signedTransaction1: SignedTransaction?
                var signedTransaction2: SignedTransaction?
                waitUntil { done in
                    wallet.sign(transaction) { signedTransaction in
                        signedTransaction1 = signedTransaction
                        done()
                    }
                }
                waitUntil { done in
                    wallet.sign(transaction) { signedTransaction in
                        signedTransaction2 = signedTransaction
                        done()
                    }
                }
                expect(signedTransaction1) == signedTransaction2
            }
        }
    }
}

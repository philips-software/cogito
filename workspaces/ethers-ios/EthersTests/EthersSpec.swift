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

        context("wallet") {
            var wallet: Wallet!

            beforeEach {
                wallet = Wallet.createRandom()
            }

            context("signing transactions") {
                let transaction = Transaction()

                func sign(_ transaction: Transaction) throws -> SignedTransaction {
                    var result: SignedTransaction!
                    var error: WalletError!
                    waitUntil { done in
                        wallet.sign(transaction) {
                            error = $0; result = $1; done()
                        }
                    }
                    if (error != nil) { throw error }
                    return result
                }

                it("produces a signed transaction") {
                    let signatureLength = 65 * 2
                    try! expect(sign(transaction).count) > "0x".count + signatureLength
                }

                it("throws when signing fails") {
                    var incorrectTransaction = transaction
                    incorrectTransaction.to = "invalid address"
                    expect { try sign(incorrectTransaction) }.to(throwError())
                }

                it("is deterministic") {
                    try! expect(sign(transaction)) == sign(transaction)
                }

                it("incorporates the 'to' address") {
                    var differentTransaction = transaction
                    differentTransaction.to = "0xd115bffabbdd893a6f7cea402e7338643ced44a6"
                    try! expect(sign(transaction)) != sign(differentTransaction)
                }

                it("incorporates the gas limit") {
                    var differentTransaction = transaction
                    differentTransaction.gasLimit = "0x42"
                    try! expect(sign(transaction)) != sign(differentTransaction)
                }

                it("incorporates the gas price") {
                    var differentTransaction = transaction
                    differentTransaction.gasPrice = "0x42"
                    try! expect(sign(transaction)) != sign(differentTransaction)
                }

                it("incorporates the nonce") {
                    var differentTransaction = transaction
                    differentTransaction.nonce = "0x42"
                    try! expect(sign(transaction)) != sign(differentTransaction)
                }

                it("incorporates the data") {
                    var differentTransaction = transaction
                    differentTransaction.data = Data(bytes: [1, 2, 3])
                    try! expect(sign(transaction)) != sign(differentTransaction)
                }

                it("incorporates the value") {
                    var differentTransaction = transaction
                    differentTransaction.value = "0x42"
                    try! expect(sign(transaction)) != sign(differentTransaction)
                }

                it("incorporates the chain id") {
                    var differentTransaction = transaction
                    differentTransaction.chainId = "0x42"
                    try! expect(sign(transaction)) != sign(differentTransaction)
                }
            }

            context("serialization") {
                let password = "secret 🤫"

                func encrypt(password: String) throws -> EncryptedWallet {
                    var result: EncryptedWallet!
                    var error: WalletError!
                    waitUntil(timeout: 10) { done in
                        wallet.encrypt(password: password) {
                            error = $0; result = $1; done()
                        }
                    }
                    if (error != nil) { throw error }
                    return result
                }

                func decrypt(json: String, password: String) throws -> Wallet {
                    var result: Wallet!
                    var error: WalletError!
                    waitUntil(timeout: 10) { done in
                        Wallet.fromEncryptedJson(json: json, password: password) {
                            error = $0; result = $1; done()
                        }
                    }
                    if (error != nil) { throw error }
                    return result
                }

                it("can be encrypted") {
                    try! expect(encrypt(password: password)).toNot(beNil())
                }

                it("can be decrypted") {
                    let encrypted = try! encrypt(password: password)
                    let decrypted = try! decrypt(json: encrypted, password: password)
                    expect(decrypted.address) == wallet.address
                }

                it("throws when decryption fails") {
                    expect { try decrypt(json: "invalid", password: password) }.to(throwError())
                }
            }
        }
    }
}

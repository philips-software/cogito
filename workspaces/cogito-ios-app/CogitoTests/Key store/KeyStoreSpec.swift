import Quick
import Nimble
import BigInt
@testable import Cogito

let lightScryptN = 1 << 12
let lightScryptP = 6

class KeyStoreSpec: QuickSpec {
    override func spec() {
        it("can be encoded and decoded") {
            let keyStore = KeyStore(name: "some name", scryptN: 1, scryptP: 2)
            let encoder = JSONEncoder()
            var data: Data!
            expect {
                data = try encoder.encode(keyStore)
            }.toNot(throwError())
            let encoded = String(data: data, encoding: .utf8)
            expect(encoded) == "{\"name\":\"some name\",\"scryptN\":1,\"scryptP\":2}"

            let decoder = JSONDecoder()
            var decodedKeyStore: KeyStore!
            expect {
                decodedKeyStore = try decoder.decode(KeyStore.self, from: data)
            }.toNot(throwError())
            expect(decodedKeyStore) == keyStore
        }

        context("using real file system") {
            var keyStore: KeyStore!

            beforeEach {
                keyStore = KeyStore(name: "some name", scryptN: 1, scryptP: 2)
            }

            afterEach {
                try? keyStore?.reset()
            }

            it("can be reset") {
                expect {
                    try FileManager.default.createDirectory(at: keyStore.url,
                                                            withIntermediateDirectories: false,
                                                            attributes: [:])
                    }.toNot(throwError())
                expect(FileManager.default.fileExists(atPath: keyStore.path)).to(beTrue())
                expect { try keyStore.reset() }.toNot(throwError())
                expect(FileManager.default.fileExists(atPath: keyStore.path)).to(beFalse())
            }
        }

        context("given an initialized key store") {
            var keyStore: KeyStore!
            var keychainMock: KeychainMock!
            var appPassword: AppPassword!

            beforeEach {
                keychainMock = KeychainMock()
                appPassword = AppPassword(keychain: keychainMock)
                keyStore = KeyStore(name: "testStore.keyStore",
                                    scryptN: lightScryptN,
                                    scryptP: lightScryptP)
                keyStore.appPassword = appPassword
                expect {
                    try FileManager.default.createDirectory(at: keyStore.url,
                                                            withIntermediateDirectories: false,
                                                            attributes: [:])
                }.toNot(throwError())
            }

            afterEach {
                try? keyStore.reset()
            }

            context("given an account") {
                var identity: Identity!

                beforeEach {
                    waitUntil { done in
                        keyStore.newAccount { address, error in
                            expect(error).to(beNil())
                            expect(address).toNot(beNil())
                            identity = Identity(
                                description: "test",
                                address: address!
                            )
                            done()
                        }
                    }
                }

                it("finds the account matching an identity") {
                    expect(keyStore.findAccount(identity: identity)).toNot(beNil())
                }

                it("calls key store to sign a transaction") {
                    let from = identity.address
                    let to = Address.testAddress2
                    let data = "some data".data(using: .utf8)!
                    let nonce = BigInt(1)
                    let gasPrice = BigInt(2)
                    let gasLimit = BigInt(3)
                    let value = BigInt(4)
                    let chainId = BigInt(42)
                    let transaction = UnsignedTransaction(
                        from: from,
                        to: to,
                        data: data,
                        nonce: nonce,
                        gasPrice: gasPrice,
                        gasLimit: gasLimit,
                        value: value,
                        chainId: chainId
                    )
                    waitUntil { done in
                        keyStore.sign(
                            transaction: transaction,
                            identity: identity
                        ) { signed, error in
                            expect(error).to(beNil())
                            expect(signed).toNot(beNil())
                            done()
                        }
                    }
                }
            }
        }
    }
}

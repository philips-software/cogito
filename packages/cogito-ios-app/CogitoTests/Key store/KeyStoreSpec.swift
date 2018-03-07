//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import Geth
import BigInt

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

        it("can be reset") {
            let keyStore = KeyStore(name: "some name", scryptN: 1, scryptP: 2)
            expect {
                try FileManager.default.createDirectory(at: keyStore.storeUrl,
                                                        withIntermediateDirectories: false,
                                                        attributes: [:])
            }.toNot(throwError())
            expect(FileManager.default.fileExists(atPath: keyStore.storeUrl.path)).to(beTrue())
            expect { try keyStore.reset() }.toNot(throwError())
            expect(FileManager.default.fileExists(atPath: keyStore.storeUrl.path)).to(beFalse())
        }

        context("given an initialized key store") {
            var keyStore: KeyStore!
            var keychainMock: KeychainMock!
            var appPassword: AppPassword!

            beforeEach {
                keychainMock = KeychainMock()
                appPassword = AppPassword(keychain: keychainMock)
                keyStore = KeyStore(name: "testStore.keyStore",
                                    scryptN: GethLightScryptN,
                                    scryptP: GethLightScryptP)
                keyStore.appPassword = appPassword
                expect {
                    try FileManager.default.createDirectory(at: keyStore.storeUrl,
                                                            withIntermediateDirectories: false,
                                                            attributes: [:])
                }.toNot(throwError())
            }

            afterEach {
                try? keyStore.reset()
            }

            context("given an account") {
                var createdAccount: GethAccount!
                var identity: Identity!

                beforeEach {
                    waitUntil { done in
                        keyStore.newAccount { account, error in
                            expect(error).to(beNil())
                            expect(account).toNot(beNil())
                            createdAccount = account
                            identity = Identity(description: "test",
                                                address: Address(from: createdAccount.getAddress()!))
                            done()
                        }
                    }
                }

                it("finds the account matching an identity") {
                    let foundAccount = keyStore.findAccount(identity: identity)!
                    expect(foundAccount.getAddress().getHex()) == createdAccount.getAddress().getHex()
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

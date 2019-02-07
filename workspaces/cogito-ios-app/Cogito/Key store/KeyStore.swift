import Geth
import BigInt
import Ethers

class KeyStore: Codable {
    let name: String
    let scryptN: Int
    let scryptP: Int
    lazy var wrapped: GethKeyStore? = GethKeyStore(directory.path, scryptN: scryptN, scryptP: scryptP)
    let directory: KeyStoreDirectory
    var appPassword = AppPassword()

    required init(name: String, scryptN: Int, scryptP: Int) {
        self.name = name
        self.directory = KeyStoreDirectory(name: name)
        self.scryptN = scryptN
        self.scryptP = scryptP
    }

    required convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let name = try container.decode(String.self, forKey: .name)
        let scryptN = try container.decode(Int.self, forKey: .scryptN)
        let scryptP = try container.decode(Int.self, forKey: .scryptP)
        self.init(name: name, scryptN: scryptN, scryptP: scryptP)
    }

    func reset() throws {
        try directory.delete()
        try appPassword.reset()
        wrapped = nil
    }

    func newAccount(
        onProgress: @escaping (_ progress: Float) -> Void = { _ in },
        onComplete: @escaping (_ address: Address?, _ error: String?) -> Void
    ) {
        appPassword.use { (maybePassword, error) in
            if let password = maybePassword {
                let wallet = Wallet.createRandom()
                let options = [ "scrypt": [ "N": self.scryptN, "p": self.scryptP ] ]
                wallet.encrypt(password: password, options: options, onProgress: onProgress) { _, encrypted in
                    guard let encrypted = encrypted else {
                        onComplete(nil, "unable to encrypt wallet")
                        return
                    }
                    do {
                        try self.directory.create()
                        let path = self.directory.url.appendingPathComponent(wallet.address)
                        try encrypted.write(
                            to: path,
                            atomically: false,
                            encoding: .utf8
                        )
                        onComplete(Address(fromHex: wallet.address)!, nil)
                    } catch let error as NSError {
                        onComplete(nil, error.localizedDescription)
                    }
                }
            } else {
                onComplete(nil, error)
            }
        }
    }

    func findAccount(identity: Identity) -> GethAccount? {
        guard let gethKeyStore = wrapped else { return nil }

        let accounts = gethKeyStore.getAccounts()!
        for index in 0..<accounts.size() {
            do {
                let account = try accounts.get(index)
                if account.getAddress().getHex() == identity.address.value {
                    return account
                }
            } catch {}
        }
        return nil
    }

    func sign(
        transaction: UnsignedTransaction,
        identity: Identity,
        onComplete: @escaping (_ transaction: Data?, _ error: String?) -> Void
    ) {
        guard let gethKeyStore = wrapped else {
            onComplete(nil, "failed to open key store")
            return
        }

        guard let from = findAccount(identity: identity) else {
            onComplete(nil, "couldn't find geth account")
            return
        }

        let value = GethBigInt(0)!
        value.setString(transaction.value.description, base: 10)
        assert(value.string() == transaction.value.description, "value")

        let gasLimit = GethBigInt(0)!
        gasLimit.setString(transaction.gasLimit.description, base: 10)
        assert(gasLimit.string() == transaction.gasLimit.description, "gasLimit")

        let gasPrice = GethBigInt(0)!
        gasPrice.setString(transaction.gasPrice.description, base: 10)
        assert(gasPrice.string() == transaction.gasPrice.description, "gasPrice")

        let gethChainId = GethBigInt(0)!
        gethChainId.setString(transaction.chainId.description, base: 10)
        assert(gethChainId.string() == transaction.chainId.description, "chainId")

        let gethTx = GethTransaction(Int64(transaction.nonce),
                                     to: GethAddress(fromHex: transaction.to.value),
                                     amount: value,
                                     gasLimit: gasLimit,
                                     gasPrice: gasPrice,
                                     data: transaction.data)

        appPassword.use { (password, error) in
            guard let password = password else {
                print("[debug] could not obtain password: \(error ?? "unknown error")")
                onComplete(nil, "could not obtain password")
                return
            }
            do {
                let signedTx = try gethKeyStore.signTxPassphrase(from,
                                                                 passphrase: password,
                                                                 tx: gethTx,
                                                                 chainID: gethChainId)
                let signedTxRLP = try signedTx.encodeRLP()
                onComplete(signedTxRLP, nil)
            } catch let error {
                print("[error] failed to sign transaction: \(error)")
                onComplete(nil, "failed to sign transaction")
                return
            }
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(name, forKey: .name)
        try container.encode(scryptN, forKey: .scryptN)
        try container.encode(scryptP, forKey: .scryptP)
    }

    enum CodingKeys: String, CodingKey {
        case name
        case scryptN
        case scryptP
    }
}

extension KeyStore {
    var url: URL {
        return directory.url
    }

    var path: String {
        return directory.path
    }
}

extension KeyStore: Equatable {
    static func == (lhs: KeyStore, rhs: KeyStore) -> Bool {
        return lhs.name == rhs.name && lhs.scryptN == rhs.scryptN && lhs.scryptP == rhs.scryptP
    }
}

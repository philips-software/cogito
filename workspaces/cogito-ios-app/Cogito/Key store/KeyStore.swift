import Geth
import BigInt

protocol GethKeyStoreT {
    // swiftlint:disable identifier_name
    func getAccounts() -> GethAccounts!
    func newAccount(_ passphrase: String!) throws -> GethAccount
    func signTxPassphrase(_ account: GethAccount!, passphrase: String!,
                          tx: GethTransaction!, chainID: GethBigInt!) throws -> GethTransaction
    // swiftlint:enable identifier_name
}

extension GethKeyStore: GethKeyStoreT {}

class KeyStore: Codable {
    let name: String
    let scryptN: Int
    let scryptP: Int
    lazy var wrapped: GethKeyStoreT? = GethKeyStore(storeUrl.path, scryptN: scryptN, scryptP: scryptP)
    var storeUrl: URL {
        let base = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        return base.appendingPathComponent(name)
    }
    var appPassword = AppPassword()

    required init(name: String, scryptN: Int, scryptP: Int) {
        self.name = name
        self.scryptN = scryptN
        self.scryptP = scryptP
    }

    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        name = try container.decode(type(of: self.name), forKey: .name)
        scryptN = try container.decode(type(of: self.scryptN), forKey: .scryptN)
        scryptP = try container.decode(type(of: self.scryptP), forKey: .scryptP)
    }

    func reset() throws {
        if FileManager.default.fileExists(atPath: storeUrl.path) {
            try FileManager.default.removeItem(at: storeUrl)
        }
        try appPassword.reset()
        wrapped = nil
    }

    func newAccount(onComplete: @escaping (_ account: GethAccount?, _ error: String?) -> Void) {
        print("[debug] creating new account in key store at \(storeUrl)")
        guard let gethKeyStore = wrapped else {
            onComplete(nil, "failed to open key store")
            return
        }
        appPassword.use { (maybePassword, error) in
            if let password = maybePassword {
                do {
                    let gethAccount = try gethKeyStore.newAccount(password)
                    onComplete(gethAccount, nil)
                } catch let error {
                    onComplete(nil, error.localizedDescription)
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
                                     to: transaction.to.toGethAddress(),
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

extension KeyStore: Equatable {
    static func == (lhs: KeyStore, rhs: KeyStore) -> Bool {
        return lhs.name == rhs.name && lhs.scryptN == rhs.scryptN && lhs.scryptP == rhs.scryptP
    }
}

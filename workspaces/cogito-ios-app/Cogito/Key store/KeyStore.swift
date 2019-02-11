import BigInt
import Ethers

// we ensure that the passwords contain enough entropy to bypass Scrypt
let passwordLength = 32
let unsafeScryptN = 1
let unsafeScryptP = 1

class KeyStore: Codable {
    let name: String
    let scryptN: Int
    let scryptP: Int
    let directory: KeyStoreDirectory
    var appPassword = AppPassword(passwordLength: passwordLength)

    required init(
        name: String,
        scryptN: Int = unsafeScryptN,
        scryptP: Int = unsafeScryptP
    ) {
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

    func findAccount(identity: Identity) -> URL? {
        let address = identity.address.value
        let path = self.directory.url.appendingPathComponent(address)
        if FileManager.default.fileExists(atPath: path.path) {
            return path
        } else {
            return nil
        }
    }

    func sign(
        transaction unsigned: UnsignedTransaction,
        identity: Identity,
        onComplete: @escaping (_ transaction: Data?, _ error: String?) -> Void
    ) {
        guard let walletUrl = findAccount(identity: identity) else {
            onComplete(nil, "couldn't find wallet")
            return
        }

        let transaction = Transaction(
            to: unsigned.to.value,
            gasLimit: unsigned.gasLimit.hex,
            gasPrice: unsigned.gasPrice.hex,
            nonce: unsigned.nonce.hex,
            data: unsigned.data,
            value: unsigned.value.hex,
            chainId: unsigned.chainId.hex
        )

        appPassword.use { (password, error) in
            guard let password = password else {
                onComplete(nil, "could not obtain password")
                return
            }
            do {
                let json = try String(contentsOf: walletUrl)
                Wallet.fromEncryptedJson(json: json, password: password) { error, wallet in
                    guard let wallet = wallet else {
                        onComplete(nil, error?.localizedDescription)
                        return
                    }
                    wallet.sign(transaction) { error, signed in
                        guard let signed = signed else {
                            onComplete(nil, error?.localizedDescription)
                            return
                        }
                        onComplete(Data(fromHex: signed), nil)
                    }
                }
            } catch {
                onComplete(nil, "could not open wallet")
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

private extension BigInt {
    var hex: String {
        return "0x\(String(self, radix: 16))"
    }
}

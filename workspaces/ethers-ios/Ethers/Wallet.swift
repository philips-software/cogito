import JavaScriptCore

public class Wallet {
    let javascriptValue: JSValue

    private init(javascriptValue: JSValue) {
        self.javascriptValue = javascriptValue
    }

    public static func createRandom() -> Wallet {
        let ethers = Javascript.ethers
        let wallet = ethers.forProperty("Wallet")!
        let randomWallet = wallet.invokeMethod("createRandom", withArguments: [])!
        return Wallet(javascriptValue: randomWallet)
    }

    public static func fromEncryptedJson(
        json: String,
        password: String,
        onComplete: @escaping DecryptCallback
    ) {
        let ethers = Javascript.ethers
        let wallet = ethers.forProperty("Wallet")!

        wallet.invokeAsync("fromEncryptedJson", withArguments: [json, password]) {
            (error, decrypted) in
            if let error = error {
                onComplete(WalletError.DecryptError(message: error.message), nil)
            } else {
                onComplete(nil, Wallet(javascriptValue: decrypted!))
            }
        }
    }

    public var address: String {
        return javascriptValue.forProperty("address").toString()!
    }

    public func sign(_ transaction: Transaction, onComplete: @escaping SignCallback) {
        javascriptValue.invokeAsync("sign", withArguments: [transaction.asDictionary]) {
            (error, signature) in
            if let error = error {
                onComplete(WalletError.SignError(message: error.message), nil)
            } else {
                onComplete(nil, signature!.toString())
            }
        }
    }

    public func encrypt(
        password: String,
        options: [String: Any?] = [:],
        onComplete: @escaping EncryptCallback
    ) {
        javascriptValue.invokeAsync("encrypt", withArguments: [password, options]) {
            (error, encrypted) in
            if let error = error {
                onComplete(WalletError.EncryptError(message: error.message), nil)
            } else {
                onComplete(nil, encrypted!.toString())
            }
        }
    }

    public typealias SignCallback = (WalletError?, SignedTransaction?) -> Void
    public typealias EncryptCallback = (WalletError?, EncryptedWallet?) -> Void
    public typealias DecryptCallback = (WalletError?, Wallet?) -> Void
}

public typealias SignedTransaction = String
public typealias EncryptedWallet = String

public enum WalletError: Error {
    case SignError(message: String)
    case EncryptError(message: String)
    case DecryptError(message: String)
}

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

    public static func fromEncryptedJson(json: String, password: String, onComplete: @escaping DecryptCallback) {
        let ethers = Javascript.ethers
        let wallet = ethers.forProperty("Wallet")!

        let onSuccess: @convention(block) (JSValue?) -> Void = { decrypted in
            onComplete(nil, Wallet(javascriptValue: decrypted!))
        }
        let onFailure: @convention(block) (JSValue?) -> Void = { message in
            onComplete(WalletError.DecryptError(message: message!.toString()), nil)
        }
        wallet.invokeMethod("fromEncryptedJson", withArguments: [json, password])!
            .invokeMethod("then", withArguments: [unsafeBitCast(onSuccess, to: AnyObject.self)])
            .invokeMethod("catch", withArguments: [unsafeBitCast(onFailure, to: AnyObject.self)])
    }

    public var address: String {
        return javascriptValue.forProperty("address").toString()!
    }

    public func sign(_ transaction: Transaction, onComplete: @escaping SignCallback) {
        let onSuccess: @convention(block) (JSValue?) -> Void = { signature in
            onComplete(nil, signature!.toString())
        }
        let onFailure: @convention(block) (JSValue?) -> Void = { error in
            let message = error!.forProperty("message")!.toString()!
            onComplete(WalletError.SignError(message: message), nil)
        }
        javascriptValue.invokeMethod("sign", withArguments: [transaction.asDictionary])!
            .invokeMethod("then", withArguments: [unsafeBitCast(onSuccess, to: AnyObject.self)])
            .invokeMethod("catch", withArguments: [unsafeBitCast(onFailure, to: AnyObject.self)])
    }

    public func encrypt(password: String, onComplete: @escaping EncryptCallback) {
        let onSuccess: @convention(block) (JSValue?) -> Void = { encrypted in
            onComplete(nil, encrypted!.toString())
        }
        let onFailure: @convention(block) (JSValue?) -> Void = { error in
            let message = error!.forProperty("message")!.toString()!
            onComplete(WalletError.EncryptError(message: message), nil)
        }
        javascriptValue.invokeMethod("encrypt", withArguments: [password])!
            .invokeMethod("then", withArguments: [unsafeBitCast(onSuccess, to: AnyObject.self)])
            .invokeMethod("catch", withArguments: [unsafeBitCast(onFailure, to: AnyObject.self)])
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

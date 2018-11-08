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

    public var address: String {
        return javascriptValue.forProperty("address").toString()!
    }

    public func sign(_ transaction: Transaction, onComplete: @escaping SignCallback) {
        let promise = javascriptValue.invokeMethod("sign", withArguments: [transaction.asDictionary])!
        let onSuccess: @convention(block) (JSValue?) -> Void = { signature in
            onComplete(nil, signature!.toString())
        }
        let onFailure: @convention(block) (JSValue?) -> Void = { error in
            let message = error!.forProperty("message")!.toString()!
            onComplete(WalletError.SignError(message: message), nil)
        }
        promise
            .invokeMethod("then", withArguments: [unsafeBitCast(onSuccess, to: AnyObject.self)])
            .invokeMethod("catch", withArguments: [unsafeBitCast(onFailure, to: AnyObject.self)])
    }

    public typealias SignCallback = (WalletError?, SignedTransaction?) -> Void
}

public typealias SignedTransaction = String

public enum WalletError: Error {
    case SignError(message: String)
}

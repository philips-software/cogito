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
        let callback: @convention(block) (JSValue?) -> Void = { signature in
            onComplete(signature!.toString())
        }
        promise.invokeMethod("then", withArguments: [unsafeBitCast(callback, to: AnyObject.self)])
    }

    public typealias SignCallback = (SignedTransaction) -> Void
}

public typealias SignedTransaction = String

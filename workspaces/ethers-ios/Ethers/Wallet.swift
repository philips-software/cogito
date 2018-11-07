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
}

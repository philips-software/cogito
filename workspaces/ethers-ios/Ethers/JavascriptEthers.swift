import JavaScriptCore
import JavascriptWrapper

extension JSContext {
    func addEthers() -> JSContext {
        return self.load(bundle: Bundle(for: Ethers.self), filename: "ethers.min")
    }
    
    private class Ethers {}
}

extension Javascript {
    static var ethers: JSValue {
        return context.globalObject.forProperty("ethers")
    }
}

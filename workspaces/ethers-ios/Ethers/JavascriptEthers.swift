import JavaScriptCore

extension JSContext {
    func addEthers() -> JSContext {
        return self.load(filename: "ethers.min")
    }
}

extension Javascript {
    static var ethers: JSValue {
        return context.globalObject.forProperty("ethers")
    }
}

import JavaScriptCore

extension JSContext {
    func addAttestations() -> JSContext {
        return self
            .load(filename: "polyfill.min")
            .load(filename: "cogito-attestations.min")
    }
}

extension Javascript {
    static var cogitoAttestations: JSValue {
        return context.globalObject.forProperty("cogitoAttestations")
    }
}

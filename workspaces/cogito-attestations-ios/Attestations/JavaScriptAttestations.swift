import JavaScriptCore

extension JSContext {
    func addAttestations() -> JSContext {
        return self
            .load(filename: "polyfill.min")
            .load(filename: "cogito-attestations.min")
    }
}

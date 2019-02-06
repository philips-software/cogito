import JavaScriptCore
import JavascriptWrapper

extension JSContext {
    func addAttestations() -> JSContext {
        return self
            .load(bundle: Bundle(for: Javascript.self), filename: "polyfill.min")
            .load(bundle: Bundle(for: Javascript.self), filename: "cogito-attestations.min")
    }
}

extension Javascript {
    static var cogitoAttestations: JSValue {
        return context.globalObject.forProperty("cogitoAttestations")
    }
}

import JavaScriptCore
import Security

class Javascript {
    static let context = JSContext()!
        .setExceptionHandler()
        .addConsole()
        .addCrypto()
        .addAttestations()
}

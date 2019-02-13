import KeychainAccess
import Security

private let appPasswordKey = "appPassword"

class AppPassword {
    let keychain: KeychainType
    let passwordLength: Int

    init(keychain: KeychainType = Keychain(), passwordLength: Int) {
        self.keychain = keychain
        self.passwordLength = passwordLength
    }

    func use(_ withPassword: @escaping (_ password: String?, _ error: String?) -> Void) {
        let passwordLength = self.passwordLength
        let callback = { (password, error) in
            DispatchQueue.main.async {
                withPassword(password, error)
            }
        }

        DispatchQueue.global().async { [weak self] in
            guard let this = self else {
                callback(nil, nil)
                return
            }
            var password = this.loadPassword()
            if password == nil {
                do {
                    password = try this.keychain.generatePassword(
                        lengthInBytes: passwordLength
                    )
                } catch let error {
                    callback(nil, error.localizedDescription)
                    return
                }
                if let error = this.store(password: password!) {
                    callback(nil, error)
                    return
                }
            }
            callback(password!, nil)
        }
    }

    private func loadPassword() -> String? {
        do {
            let password = try keychain
                .withAuthenticationPrompt("Authenticate to unlock your secure account data")
                .get(appPasswordKey)
            return password
        } catch {
            return nil
        }
    }

    private func store(password: String) -> String? {
        do {
            try keychain
                .withAccessibility(.whenUnlocked, authenticationPolicy: .userPresence)
                .withAuthenticationPrompt("Authenticate to securely store account data")
                .set(password, key: appPasswordKey)
            return nil
        } catch let error {
            return error.localizedDescription
        }
    }

    func reset() throws {
        try keychain.remove(appPasswordKey)
    }
}

protocol KeychainType {
    func withAuthenticationPrompt(_ authenticationPrompt: String) -> KeychainType
    func withAccessibility(_ accessibility: Accessibility,
                           authenticationPolicy: AuthenticationPolicy) -> KeychainType
    func get(_ key: String) throws -> String?
    func set(_ value: String, key: String) throws
    func generatePassword(lengthInBytes: Int) throws -> String
    func remove(_ key: String) throws
}

extension Keychain: KeychainType {
    func withAuthenticationPrompt(_ authenticationPrompt: String) -> KeychainType {
        return self.authenticationPrompt(authenticationPrompt)
    }

    func withAccessibility(_ accessibility: Accessibility,
                           authenticationPolicy: AuthenticationPolicy) -> KeychainType {
        return self.accessibility(accessibility,
                                  authenticationPolicy: authenticationPolicy)
    }

    func generatePassword(lengthInBytes: Int) throws -> String {
        var bytes = [UInt8](repeating: 0, count: lengthInBytes)
        let result = SecRandomCopyBytes(kSecRandomDefault, lengthInBytes, &bytes)
        guard result == errSecSuccess else {
            throw GeneratePasswordError(resultCode: result)
        }
        return Data(bytes: bytes).hexEncodedString()
    }
}

extension Data {
    func hexEncodedString() -> String {
        return map { String(format: "%02hhx", $0) }.joined()
    }
}

struct GeneratePasswordError: Error {
    let resultCode: Int32
}

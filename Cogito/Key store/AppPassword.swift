//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import KeychainAccess

private let appPasswordKey = "appPassword"

class AppPassword {
    let keychain: KeychainType

    init(keychain: KeychainType = Keychain(service: "com.philips.cogito")) {
        self.keychain = keychain
    }

    func use(_ withPassword: (_ password: String?, _ error: String?) -> Void) {
        var password = loadPassword()
        if password == nil {
            password = keychain.generatePassword()
            if let error = store(password: password!) {
                withPassword(nil, error)
                return
            }
        }
        withPassword(password!, nil)
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
        } catch let e {
            return e.localizedDescription
        }
    }
}

protocol KeychainType {
    func withAuthenticationPrompt(_ authenticationPrompt: String) -> KeychainType
    func withAccessibility(_ accessibility: Accessibility,
                           authenticationPolicy: AuthenticationPolicy) -> KeychainType
    func get(_ key: String) throws -> String?
    func set(_ value: String, key: String) throws
    func generatePassword() -> String
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

    func generatePassword() -> String {
        return ""
    }
}

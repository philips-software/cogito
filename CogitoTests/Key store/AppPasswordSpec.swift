//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import KeychainAccess

class AppPasswordSpec: QuickSpec {
    override func spec() {
        var keychainMock: KeychainMock!

        beforeEach {
            keychainMock = KeychainMock()
        }

        it("provides a password and stores it") {
            var providedPassword: String?
            AppPassword(keychain: keychainMock).use { (password, error) in
                expect(password).toNot(beNil())
                expect(error).to(beNil())
                providedPassword = password
            }
            expect(providedPassword).toEventuallyNot(beNil())
            expect(keychainMock.generatePasswordCount).toEventually(equal(1))
            expect(keychainMock.setCount).toEventually(equal(1))
        }

        context("when the password is already stored") {
            beforeEach {
                keychainMock.data["appPassword"] = "some password"
            }

            it("provides the stored password") {
                var providedPassword: String?
                AppPassword(keychain: keychainMock).use { (password, error) in
                    expect(password).toNot(beNil())
                    expect(error).to(beNil())
                    providedPassword = password
                }
                expect(providedPassword).toEventuallyNot(beNil())
                expect(keychainMock.getCount).toEventually(equal(1))
                expect(keychainMock.setCount).toEventually(equal(0))
            }
        }
    }
}

class KeychainMock: KeychainType {
    var data = [String: String]()
    var getCount = 0
    var setCount = 0
    var generatePasswordCount = 0

    func withAuthenticationPrompt(_ authenticationPrompt: String) -> KeychainType {
        return self
    }

    func withAccessibility(_ accessibility: Accessibility,
                           authenticationPolicy: AuthenticationPolicy) -> KeychainType {
        return self
    }

    func get(_ key: String) throws -> String? {
        getCount += 1
        return data[key]
    }

    func set(_ value: String, key: String) throws {
        setCount += 1
        data[key] = value
    }

    func generatePassword() -> String {
        generatePasswordCount += 1
        return "test pass"
    }
}

import Quick
import Nimble
import KeychainAccess
@testable import Cogito

class AppPasswordSpec: QuickSpec {
    override func spec() {
        var keychainMock: KeychainMock!
        var appPassword: AppPassword!

        beforeEach {
            keychainMock = KeychainMock()
            appPassword = AppPassword(
                keychain: keychainMock,
                passwordLength: 16
            )
        }

        it("provides a password and stores it") {
            var providedPassword: String?
            appPassword.use { (password, error) in
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
                appPassword.use { (password, error) in
                    expect(password).toNot(beNil())
                    expect(error).to(beNil())
                    providedPassword = password
                }
                expect(providedPassword).toEventuallyNot(beNil())
                expect(providedPassword).toEventually(equal("some password"))
                expect(keychainMock.getCount).toEventually(equal(1))
                expect(keychainMock.setCount).toEventually(equal(0))
            }

            it("returns new password after reset") {
                expect { try appPassword.reset() }.toNot(throwError())
                var providedPassword: String?
                appPassword.use { (password, error) in
                    expect(password).toNot(beNil())
                    expect(error).to(beNil())
                    providedPassword = password
                }
                expect(keychainMock.removeCount).toEventually(equal(1))
                expect(providedPassword).toEventuallyNot(equal("some password"))
            }
        }
    }
}

class KeychainMock: KeychainType {
    var data = [String: String]()
    var getCount = 0
    var setCount = 0
    var removeCount = 0
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

    func remove(_ key: String) throws {
        removeCount += 1
        data.removeValue(forKey: key)
    }

    func generatePassword(lengthInBytes: Int) -> String {
        generatePasswordCount += 1
        return "test pass"
    }
}

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import Mockingjay

class OpenIDAttestationHandlerSpec: QuickSpec {
    override func spec() {
        let realmUrl = "https://example.com/realms/master"
        let openIdConfiguration: [String: Any] = [
            "authorization_endpoint": realmUrl + "/protocol/openid-connect/auth",
            "grant_types_supported": ["password", "implicit"],
            "response_types_supported": ["id_token"]
        ]
        var handler: OpenIDAttestationStarter!

        it("calls onError when openid config cannot be retrieved") {
            var receivedError: String?
            handler = OpenIDAttestationStarter(oidcRealmUrl: URL(string: realmUrl)!,
                                               onSuccess: { _ in },
                                               onError: { _, error in
                                                   receivedError = error
                                               })
            self.stub(uri(realmUrl + "/.well-known/openid-configuration"), http(404))
            handler.run()
            expect(receivedError).toEventuallyNot(beNil())
        }

        it("constructs proper URL given openid configuration") {
            handler = OpenIDAttestationStarter(oidcRealmUrl: URL(string: realmUrl)!,
                                               onSuccess: { _ in },
                                               onError: { _, _ in })
            let authUrl = handler.implicitFlowUrl(openIdConfiguration: openIdConfiguration)!
            let components = URLComponents(url: authUrl, resolvingAgainstBaseURL: false)!
            expect(components.scheme) == "https"
            expect(components.host) == "example.com"
            expect(components.path) == "/realms/master/protocol/openid-connect/auth"
            expect(components.queryItems).to(contain(URLQueryItem(name: "response_type", value: "id_token")))
            expect(components.queryItems).to(contain(URLQueryItem(name: "client_id", value: "cogito")))
            expect(components.queryItems).to(contain(URLQueryItem(name: "redirect_uri",
                                                                  value: "https://cogito.app.link/bHwkY7KrvH")))
            expect(components.queryItems).to(contain(URLQueryItem(name: "scope", value: "openid")))
            expect(components.query).to(contain("nonce="))
        }

        it("loads the OpenID Connect configuration") {
            handler = OpenIDAttestationStarter(oidcRealmUrl: URL(string: realmUrl)!,
                                               onSuccess: { _ in },
                                               onError: { _, _ in })
            self.stub(uri(realmUrl + "/.well-known/openid-configuration"), json(openIdConfiguration))
            var configuration: [String: Any]?
            handler.withOpenIdConfiguration { config, _ in
                configuration = config
            }
            expect(configuration).toEventuallyNot(beNil())

            expect {
                let expected = String(data: try JSONSerialization.data(withJSONObject: openIdConfiguration),
                                      encoding: .utf8)
                let actual = String(data: try JSONSerialization.data(withJSONObject: configuration!),
                                    encoding: .utf8)
                expect(actual) == expected
            }.toNot(beNil())
        }

        it("reports an error when it cannot load OpenID Connect configuration") {
            handler = OpenIDAttestationStarter(oidcRealmUrl: URL(string: realmUrl)!,
                                               onSuccess: { _ in },
                                               onError: { _, _ in })
            self.stub(uri(realmUrl + "/.well-known/openid-configuration"), http(404))
            var reportedError: String?
            handler.withOpenIdConfiguration { _, error in
                reportedError = error
            }
            expect(reportedError).toEventuallyNot(beNil())
        }

        describe("run") {
            var successReported: Bool = false
            var errorReported: Bool = false

            beforeEach {
                successReported = false
                errorReported = false
                handler = OpenIDAttestationStarter(oidcRealmUrl: URL(string: realmUrl)!,
                                                   onSuccess: { _ in successReported = true },
                                                   onError: { _, _ in errorReported = true })
            }

            context("when withOpenIdConfiguration fails") {
                beforeEach {
                    self.stub(uri(realmUrl + "/.well-known/openid-configuration"), http(404))
                }

                it("reports an error") {
                    handler.run()
                    expect(successReported).toEventually(beFalse())
                    expect(errorReported).toEventually(beTrue())
                }
            }

            context("when withOpenIdConfiguration succeeds") {
                context("when config contains invalid URL") {
                    beforeEach {
                        var invalidConf = openIdConfiguration
                        invalidConf["authorization_endpoint"] = "invalid url"
                        self.stub(uri(realmUrl + "/.well-known/openid-configuration"), json(invalidConf))
                    }

                    it("reports an error") {
                        handler.run()
                        expect(successReported).toEventually(beFalse())
                        expect(errorReported).toEventually(beTrue())
                    }
                }

                context("when config contains valid URL") {
                    var urlOpener: URLOpening!
                    beforeEach {
                        self.stub(uri(realmUrl + "/.well-known/openid-configuration"), json(openIdConfiguration))
                    }

                    context("when url cannot be opened") {
                        beforeEach {
                            urlOpener = MockURLOpener(canOpen: false, openResult: false)
                            handler = OpenIDAttestationStarter(oidcRealmUrl: URL(string: realmUrl)!,
                                                               onSuccess: { _ in successReported = true },
                                                               onError: { _, _ in errorReported = true },
                                                               urlOpener: urlOpener)
                        }

                        it("reports error when url cannot be opened") {
                            handler.run()
                            expect(successReported).toEventually(beFalse())
                            expect(errorReported).toEventually(beTrue())
                        }
                    }

                    context("when url can be opened but opening failed") {
                        beforeEach {
                            urlOpener = MockURLOpener(canOpen: true, openResult: false)
                            handler = OpenIDAttestationStarter(oidcRealmUrl: URL(string: realmUrl)!,
                                                               onSuccess: { _ in successReported = true },
                                                               onError: { _, _ in errorReported = true },
                                                               urlOpener: urlOpener)
                        }

                        it("reports error when opening url failed") {
                            handler.run()
                            expect(successReported).toEventually(beFalse())
                            expect(errorReported).toEventually(beTrue())
                        }
                    }
                    context("when url can be opened and opening succeeded") {
                        beforeEach {
                            urlOpener = MockURLOpener(canOpen: true, openResult: true)
                            handler = OpenIDAttestationStarter(oidcRealmUrl: URL(string: realmUrl)!,
                                                               onSuccess: { _ in successReported = true },
                                                               onError: { _, _ in errorReported = true },
                                                               urlOpener: urlOpener)
                        }

                        it("reports success when opening url succeeded") {
                            handler.run()
                            expect(successReported).toEventually(beTrue())
                            expect(errorReported).toEventually(beFalse())
                        }
                    }
                }
            }
        }
    }
}

class MockURLOpener: URLOpening {
    let canOpen: Bool
    let openResult: Bool
    var openedUrl: URL?

    init(canOpen: Bool, openResult: Bool) {
        self.canOpen = canOpen
        self.openResult = openResult
    }

    func canOpenURL(_ url: URL) -> Bool {
        return canOpen
    }

    func open(_ url: URL, options: [String: Any], completionHandler completion: ((Bool) -> Void)?) {
        DispatchQueue.main.async {
            self.openedUrl = url
            completion?(self.openResult)
        }
    }
}

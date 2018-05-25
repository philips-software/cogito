//Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
import Regex
@testable import Telepath

class UrlCodecSpec: QuickSpec {
    override func spec() {
        let baseUrl = URL(string: "https://example.com/")!
        let channelId: ChannelID = "channel id abcd/+#1234"
        let channelKey = ChannelKey.example()
        let appName = "Some app name with unicode characters ✅😎"

        let codec = UrlCodec()

        context("when encoding") {
            var encoded: URL!

            beforeEach {
                encoded = codec.encode(
                    baseUrl: baseUrl,
                    channelId: channelId,
                    key: channelKey,
                    appName: appName
                )
            }

            it("uses the correct base URL") {
                expect(encoded.baseURL) == baseUrl
            }

            it("uses correct relative path") {
                expect(Array(encoded.pathComponents.suffix(2))) == ["telepath", "connect"]
            }

            it("encodes the channel id") {
                let encodedChannelId = channelId.encodeForUrlFragment()
                expect(encoded.fragment).to(contain("I=\(encodedChannelId)"))
            }

            it("encodes the encryption key") {
                let encodedEncryptionKey = channelKey.base64urlEncodedString()
                expect(encoded.fragment).to(contain("E=\(encodedEncryptionKey)"))
            }

            it("encodes the app name") {
                let encodedAppName = appName.data(using: .utf8)!.base64urlEncodedString()
                expect(encoded.fragment).to(contain("A=\(encodedAppName)"))
            }
        }

        context("when decoding") {
            var decodedChannelId: ChannelID!
            var decodedChannelKey: ChannelKey!
            var decodedAppName: String!

            beforeEach {
                let encoded = codec.encode(
                    baseUrl: baseUrl,
                    channelId: channelId,
                    key: channelKey,
                    appName: appName
                )
                let decoded = try! codec.decode(url: encoded)
                decodedChannelId = decoded.channelId
                decodedChannelKey = decoded.channelKey
                decodedAppName = decoded.appName
            }

            it("extracts the correct channeld id") {
                expect(decodedChannelId) == channelId
            }

            it("extracts the correct encryption key") {
                expect(decodedChannelKey) == channelKey
            }

            it("extracts the correct app name") {
                expect(decodedAppName) == appName
            }
        }

        describe("decoding errors") {
            typealias DecodeError = UrlCodec.DecodeError

            let correctUrl = codec.encode(
                baseUrl: baseUrl,
                channelId: channelId,
                key: channelKey,
                appName: appName
            )

            it("rejects URLs with missing fragment") {
                let wrongUrl = correctUrl.replacingAll(matching: "#.*$", with: "")!
                let error = DecodeError.missingParameters
                expect { try codec.decode(url: wrongUrl) }.to(throwError(error))
            }

            it("rejects URLs with missing channel id") {
                let wrongUrl = correctUrl.replacingAll(matching: "#I=[^&]*&", with: "#")!
                let error = DecodeError.missingChannelId
                expect { try codec.decode(url: wrongUrl) }.to(throwError(error))
            }

            it("rejects URLs with missing encryption key") {
                let wrongUrl = correctUrl.replacingAll(matching: "&E=[^&]*&", with: "&")!
                let error = DecodeError.missingEncryptionKey
                expect { try codec.decode(url: wrongUrl) }.to(throwError(error))
            }

            it("rejects encryption key that is not base64url encoded") {
                let wrongKey = "&E=invalid!&"
                let wrongUrl = correctUrl.replacingAll(matching: "&E=[^&]*&", with: wrongKey)!
                let error = DecodeError.invalidEncryptionKey
                expect { try codec.decode(url: wrongUrl) }.to(throwError(error))
            }

            it("rejects URLs with missing app name") {
                let wrongUrl = correctUrl.replacingAll(matching: "&A=[^&]*$", with: "&")!
                let error = DecodeError.missingAppName
                expect { try codec.decode(url: wrongUrl) }.to(throwError(error))
            }

            it("rejects app name that is not base64url encoded") {
                let wrongName = "&A=invalid!&"
                let wrongUrl = correctUrl.replacingAll(matching: "&A=[^&]*$", with: wrongName)!
                let error = DecodeError.invalidAppName
                expect { try codec.decode(url: wrongUrl) }.to(throwError(error))
            }

            it("rejects the wrong relative path") {
                let wrongUrl = correctUrl.replacingAll(matching: "telepath", with: "wrong")!
                let error = DecodeError.invalidPath
                expect { try codec.decode(url: wrongUrl) }.to(throwError(error))
            }
        }
    }
}

private extension URL {
    func replacingAll(matching regex: StaticString, with replacement: String) -> URL? {
        var urlString = self.absoluteString
        urlString = urlString.replacingAll(matching: regex, with: replacement)
        return URL(string: urlString)
    }
}

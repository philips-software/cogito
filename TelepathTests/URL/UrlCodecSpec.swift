//Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
import Regex
@testable import Telepath

class UrlCodecSpec: QuickSpec {
    override func spec() {
        let scheme = "somescheme"
        let channelId: ChannelID = "channel id abcd/+#1234"
        let channelKeys = ChannelKeys.example()

        let codec = UrlCodec()

        context("when encoding") {
            var encoded: URL!

            beforeEach {
                encoded = codec.encode(
                    scheme: scheme,
                    channelId: channelId,
                    keys: channelKeys
                )
            }

            it("uses the correct URL scheme") {
                expect(encoded.scheme) == scheme
            }

            it("uses predefined host and path") {
                expect(encoded.host) == "telepath"
                expect(encoded.path) == "/connect"
            }

            it("encodes the channel id") {
                let encodedChannelId = channelId.encodeForUrlFragment()
                expect(encoded.fragment).to(contain("I=\(encodedChannelId)"))
            }

            it("encodes the encryption key") {
                let encodedEncryptionKey = channelKeys.encryptionKey.base64urlEncodedString()
                expect(encoded.fragment).to(contain("E=\(encodedEncryptionKey)"))
            }

            it("encodes the message authentication key") {
                let encodedHmacKey = channelKeys.hmacKey.base64urlEncodedString()
                expect(encoded.fragment).to(contain("A=\(encodedHmacKey)"))
            }
        }

        context("when decoding") {
            var decodedChannelId: ChannelID!
            var decodedChannelKeys: ChannelKeys!

            beforeEach {
                let encoded = codec.encode(
                    scheme: scheme,
                    channelId: channelId,
                    keys: channelKeys
                )
                let decoded = try! codec.decode(url: encoded)
                decodedChannelId = decoded.channelId
                decodedChannelKeys = decoded.channelKeys
            }

            it("extracts the correct channeld id") {
                expect(decodedChannelId) == channelId
            }

            it("extracts the correct encryption keys") {
                expect(decodedChannelKeys.encryptionKey) == channelKeys.encryptionKey
                expect(decodedChannelKeys.hmacKey) == channelKeys.hmacKey
            }
        }

        describe("decoding errors") {
            typealias DecodeError = UrlCodec.DecodeError

            let correctUrl = codec.encode(
                scheme: scheme,
                channelId: channelId,
                keys: channelKeys
            )

            it("rejects URLs with missing fragment") {
                let wrongUrl = correctUrl.replacingAll(matching: "#.*$", with: "")!
                let error = DecodeError.missingParameters
                expect { try codec.decode(url: wrongUrl) }.to(throwError(error))
            }

            it("rejects URLs with missing channel id") {
                let wrongUrl = correctUrl.replacingAll(matching: "I=[^&]*&", with: "")!
                let error = DecodeError.missingChannelId
                expect { try codec.decode(url: wrongUrl) }.to(throwError(error))
            }

            it("rejects URLS with missing encryption key") {
                let wrongUrl = correctUrl.replacingAll(matching: "E=[^&]*&", with: "")!
                let error = DecodeError.missingEncryptionKey
                expect { try codec.decode(url: wrongUrl) }.to(throwError(error))
            }

            it("rejects URLs with missing authentication key") {
                let wrongUrl = correctUrl.replacingAll(matching: "A=.*$", with: "")!
                let error = DecodeError.missingAuthenticationKey
                expect { try codec.decode(url: wrongUrl) }.to(throwError(error))
            }

            it("rejects encryption key that is not base64url encoded") {
                let wrongKey = "E=invalid!&"
                let wrongUrl = correctUrl.replacingAll(matching: "E=[^&]*&", with: wrongKey)!
                let error = DecodeError.invalidEncryptionKey
                expect { try codec.decode(url: wrongUrl) }.to(throwError(error))
            }

            it("rejects authentication key that is not base64url encoded") {
                let wrongKey = "A=wrong!"
                let wrongUrl = correctUrl.replacingAll(matching: "A=.*$", with: wrongKey)!
                let error = DecodeError.invalidAuthenticationKey
                expect { try codec.decode(url: wrongUrl) }.to(throwError(error))
            }

            it("rejects the wrong host") {
                let wrongUrl = correctUrl.replacingAll(matching: "telepath", with: "wrong")!
                let error = DecodeError.invalidHostname
                expect { try codec.decode(url: wrongUrl) }.to(throwError(error))
            }

            it("rejects the wrong path") {
                let wrongUrl = correctUrl.replacingAll(matching: "connect", with: "wrong")!
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

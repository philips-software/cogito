//Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
import RNCryptor
@testable import Telepath

class UrlCodecSpec: QuickSpec {
    override func spec() {
        let scheme = "somescheme"
        
        var codec: UrlCodec!
        
        beforeEach {
            codec = UrlCodec(scheme: scheme)
        }
        
        context("when encoding") {
            let channelId: ChannelID = "abcd/+#1234"
            let encryptionKey: AES256Key = RNCryptor.randomData(ofLength: 32)
            let hmacKey: HMACKey = RNCryptor.randomData(ofLength: 32)
            
            var encoded: URL!
            
            beforeEach {
                let channelKeys = ChannelKeys(
                    encryptionKey: encryptionKey,
                    hmacKey: hmacKey
                )
                encoded = codec.encode(channelId: channelId, keys: channelKeys)
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
                let encodedEncryptionKey = encryptionKey.base64urlEncodedString()
                expect(encoded.fragment).to(contain("E=\(encodedEncryptionKey)"))
            }
            
            it("encodes the message authentication key") {
                let encodedHmacKey = hmacKey.base64urlEncodedString()
                expect(encoded.fragment).to(contain("A=\(encodedHmacKey)"))
            }
        }
    }
}

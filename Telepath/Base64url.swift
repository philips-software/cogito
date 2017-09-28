//Copyright © 2017 Philips. All rights reserved.

extension Data {
    func base64urlEncodedString() -> String {
        var result = self.base64EncodedString()
        result = result.replacingOccurrences(of: "+", with: "-")
        result = result.replacingOccurrences(of: "/", with: "_")
        return result
    }
}

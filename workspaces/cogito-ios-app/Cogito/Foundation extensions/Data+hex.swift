//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

extension Data {
    init?(fromHex: String) {
        guard fromHex.count % 2 == 0 else {
            return nil
        }

        var bytes = [UInt8]()
        let hex = fromHex.lowercased().unicodeScalars
        var index = hex.startIndex
        if fromHex.hasPrefix("0x") {
            index = hex.index(index, offsetBy: 2)
        }
        while index < hex.endIndex {
            let nextIndex = hex.index(index, offsetBy: 1)
            let leftNibble = hexNibble(hex[index].value)
            let rightNibble = hexNibble(hex[nextIndex].value)
            guard leftNibble < 16 && rightNibble < 16 else {
                return nil
            }
            let byte = leftNibble * 16 + rightNibble
            bytes.append(byte)
            index = hex.index(index, offsetBy: 2)
        }
        self.init(bytes: bytes)
    }
}

private func hexNibble(_ scalar: UInt32) -> UInt8 {
    if scalar > valueOf9 {
        return UInt8(10 + scalar - valueOfa)
    } else {
        return UInt8(scalar - valueOf0)
    }
}

private let valueOf0 = UnicodeScalar("0").value
private let valueOf9 = UnicodeScalar("9").value
private let valueOfa = UnicodeScalar("a").value

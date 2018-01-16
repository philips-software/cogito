//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import BigInt

struct Transaction {
    let from: Address
    let to: Address // swiftlint:disable:this identifier_name
    let data: Data
    let nonce: BigInt
    let gasPrice: BigInt
    let gasLimit: BigInt
    let value: BigInt

    init?(from txDict: [String: Any]) {
        guard let from = takeAddress(from: txDict, key: "from"),
              let to = takeAddress(from: txDict, key: "to"),
              let gasPrice = takeNumber(from: txDict, key: "gasPrice"),
              let gasLimit = takeNumber(from: txDict, key: "gasLimit"),
              let value = takeNumber(from: txDict, key: "value"),
              let nonce = takeNumber(from: txDict, key: "nonce"),
              let data = takeData(from: txDict, key: "data") else {
            return nil
        }

        self.from = from
        self.to = to
        self.data = data
        self.nonce = nonce
        self.gasPrice = gasPrice
        self.gasLimit = gasLimit
        self.value = value
    }
}

private func takeAddress(from txDict: [String: Any], key: String) -> Address? {
    guard let addressString = txDict[key] as? String,
          let address = Address(fromHex: addressString) else {
        return nil
    }
    return address
}

private func takeNumber(from txDict: [String: Any], key: String) -> BigInt? {
    guard let numberString = txDict[key] as? String,
          let number = BigInt(fromHex: numberString) else {
        return nil
    }
    return number
}

private func takeData(from txDict: [String: Any], key: String) -> Data? {
    guard let dataString = txDict["data"] as? String,
          let data = Data(fromHex: dataString) else {
        return nil
    }
    return data
}

extension BigInt {
    init?(fromHex: String) {
        let hex: String
        if fromHex.hasPrefix("0x") {
            let after0x = fromHex.index(fromHex.startIndex, offsetBy: 2)
            hex = String(fromHex[after0x...])
        } else {
            hex = fromHex
        }
        guard hex.count > 0 else { return nil }

        self.init(hex, radix: 16)
    }
}

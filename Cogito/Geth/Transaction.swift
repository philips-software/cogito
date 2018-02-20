//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import BigInt

protocol Transaction {
    var from: Address { get }
    var to: Address { get } // swiftlint:disable:this identifier_name
    var data: Data { get }
    var nonce: BigInt { get }
    var gasPrice: BigInt { get }
    var gasLimit: BigInt { get }
    var value: BigInt { get }
}

struct UnsignedTransaction: Transaction {
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
        self.init(from: from, to: to, data: data, nonce: nonce,
                  gasPrice: gasPrice, gasLimit: gasLimit, value: value)
    }

    // swiftlint:disable:next identifier_name
    init(from: Address, to: Address, data: Data, nonce: BigInt,
         gasPrice: BigInt, gasLimit: BigInt, value: BigInt) {
        self.from = from
        self.to = to
        self.data = data
        self.nonce = nonce
        self.gasPrice = gasPrice
        self.gasLimit = gasLimit
        self.value = value
    }
}

struct SignedTransaction: Transaction {
    let from: Address
    let to: Address // swiftlint:disable:this identifier_name
    let data: Data
    let nonce: BigInt
    let gasPrice: BigInt
    let gasLimit: BigInt
    let value: BigInt
    let signingV: BigInt
    let signingR: String
    let signingS: String

    init?(from txDict: [String: Any]) {
        guard let from = takeAddress(from: txDict, key: "from"),
              let to = takeAddress(from: txDict, key: "to"),
              let gasPrice = takeNumber(from: txDict, key: "gasPrice"),
              let gasLimit = takeNumber(from: txDict, key: "gasLimit"),
              let value = takeNumber(from: txDict, key: "value"),
              let nonce = takeNumber(from: txDict, key: "nonce"),
              let data = takeData(from: txDict, key: "data"),
              let signingV = takeNumber(from: txDict, key: "v"),
              let signingR = txDict["r"] as? String,
              let signingS = txDict["s"] as? String else {
            return nil
        }
        self.init(from: from, to: to, data: data, nonce: nonce,
                  gasPrice: gasPrice, gasLimit: gasLimit, value: value,
                  signingV: signingV, signingR: signingR, signingS: signingS)
    }

    // swiftlint:disable:next identifier_name
    init(from: Address, to: Address, data: Data, nonce: BigInt,
         gasPrice: BigInt, gasLimit: BigInt, value: BigInt,
         signingV: BigInt, signingR: String, signingS: String) {
        self.from = from
        self.to = to
        self.data = data
        self.nonce = nonce
        self.gasPrice = gasPrice
        self.gasLimit = gasLimit
        self.value = value
        self.signingV = signingV
        self.signingR = signingR
        self.signingS = signingS
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
    if let numberString = txDict[key] as? String,
       let number = BigInt(fromHex: numberString) {
        return number
    } else if let number = txDict[key] as? Int {
        return BigInt(exactly: number)
    }
    return nil
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

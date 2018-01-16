//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

struct Transaction {
    let from: Address
    let to: Address // swiftlint:disable:this identifier_name
    let data: Data

    init?(from txDict: [String: Any]) {
        guard let fromString = txDict["from"] as? String, let from = Address(fromHex: fromString),
              let toString = txDict["to"] as? String, let to = Address(fromHex: toString),
              txDict["gasPrice"] != nil,
              txDict["gasLimit"] != nil,
              txDict["value"] != nil,
              txDict["nonce"] != nil,
              let dataString = txDict["data"] as? String, let data = Data(fromHex: dataString) else {
            return nil
        }

        self.from = from
        self.to = to
        self.data = data
    }
}

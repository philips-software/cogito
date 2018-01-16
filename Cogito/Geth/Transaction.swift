//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

struct Transaction {
    init?(from txDict: [String: Any]) {
        guard let fromString = txDict["from"] as? String, let _ = Address(fromHex: fromString),
              let toString = txDict["to"] as? String, let _ = Address(fromHex: toString),
              txDict["gasPrice"] != nil,
              txDict["gasLimit"] != nil,
              txDict["value"] != nil,
              txDict["nonce"] != nil,
              let dataString = txDict["data"] as? String, let _ = Data(fromHex: dataString) else {
            return nil
        }
    }
}

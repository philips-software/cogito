//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Geth

struct Address: Codable {
    private let value: String

    init(from gethAddress: GethAddress) {
        value = gethAddress.getHex()
    }

    func toGethAddress() -> GethAddress {
        return GethAddress(fromHex: value)
    }
}

extension Address: CustomStringConvertible {
    var description: String {
        return value
    }
}

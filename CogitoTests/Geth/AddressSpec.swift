//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import Geth

class AddressSpec: QuickSpec {
    override func spec() {
        it("can be created from a GethAddress") {
            let hex = "0x1111111111111111111111111111111111111111"
            let gethAddress = GethAddress(fromHex: hex)!
            let address = Address(from: gethAddress)
            expect(address.description) == hex
        }

        it("can return equivalent GethAddress") {
            let address = Address.testAddress1
            let gethAddress = address.toGethAddress()
            expect(gethAddress.getHex()) == address.description
        }
    }
}

extension Address {
    static var testAddress: Address {
        return testAddress(hex: "0x0000000000000000000000000000000000000000")
    }

    static var testAddress1: Address {
        return testAddress(hex: "0x1111111111111111111111111111111111111111")
    }

    static var testAddress2: Address {
        return testAddress(hex: "0x2222222222222222222222222222222222222222")
    }

    static func testAddress(hex: String) -> Address {
        let gethAddress = GethAddress(fromHex: hex)!
        return Address(from: gethAddress)
    }
}

import Quick
import Nimble
import Geth
@testable import Cogito

class AddressSpec: QuickSpec {
    override func spec() {
        it("can be created from a GethAddress") {
            let hex = "0x1111111111111111111111111111111111111111"
            let gethAddress = GethAddress(fromHex: hex)!
            let address = Address(from: gethAddress)
            expect(address.description) == hex
        }

        it("can be created from a hex string") {
            let hex = "0x1111111111111111111111111111111111111111"
            let address = Address(fromHex: hex)
            expect(address?.description) == hex
        }

        it("cannot be created from an invalid hax string") {
            let invalidHex = "0x1"
            expect(Address(fromHex: invalidHex)).to(beNil())
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
        return Address(fromHex: "0x0000000000000000000000000000000000000000")!
    }

    static var testAddress1: Address {
        return Address(fromHex: "0x1111111111111111111111111111111111111111")!
    }

    static var testAddress2: Address {
        return Address(fromHex: "0x2222222222222222222222222222222222222222")!
    }

    static var testAddress3: Address {
        return Address(fromHex: "0x3333333333333333333333333333333333333333")!
    }
}

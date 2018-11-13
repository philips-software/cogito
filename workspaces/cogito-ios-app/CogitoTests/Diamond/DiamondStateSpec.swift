import Quick
import Nimble
@testable import Cogito

class DiamondStateSpec: QuickSpec {
    override func spec() {
        let address = Address.example

        var identity0: Identity!

        beforeEach {
            identity0 = Identity(description: "first identity", address: address)
        }

        it("can be encoded and decoded") {
            let state = DiamondState(facets: [identity0])
            let encoder = JSONEncoder()
            var encodedData: Data!
            expect {
                encodedData = try encoder.encode(state)
            }.toNot(throwError())

            let decoder = JSONDecoder()
            var decodedState: DiamondState?
            expect {
                decodedState = try decoder.decode(DiamondState.self, from: encodedData)
            }.toNot(throwError())
            expect(decodedState) == state
        }

        it("can find an identity by address") {
            let state = DiamondState(facets: [identity0])
            expect(state.findIdentity(address: identity0.address)) == identity0
        }

        it("cannot find a non-existing identity") {
            let state = DiamondState(facets: [])
            expect(state.findIdentity(address: identity0.address)).to(beNil())
        }

        it("finding matches case insensitive") {
            let state = DiamondState(facets: [identity0])
            let uppercased = "0x" + identity0.address.value.dropFirst(2).uppercased()
            let address = Address(fromHex: uppercased)!
            expect(state.findIdentity(address: address)) == identity0
        }
    }
}

import Quick
import Nimble
import Geth
@testable import Cogito

class GarbageBinStateSpec: QuickSpec {
    override func spec() {
        it("can be encoded and decoded") {
            let key = UUID().uuidString
            let state = GarbageBinState(bin: [key: "value"])
            let encoder = JSONEncoder()
            var encodedData: Data!
            expect {
                encodedData = try encoder.encode(state)
                }.toNot(throwError())

            let decoder = JSONDecoder()
            var decodedState: GarbageBinState?
            expect {
                decodedState = try decoder.decode(GarbageBinState.self, from: encodedData)
                }.toNot(throwError())
            expect(decodedState) == state
        }

        it("can retrieve value for the given key") {
            let key = UUID().uuidString
            let value = "some value"
            let state = GarbageBinState(bin: [key: value])
            expect(state.valueForKey(key: key)) == value
        }

        it("can retrieve value for the given key when there is more than one value in the store") {
            let key = UUID().uuidString
            let value = "some value"
            let state = GarbageBinState(bin: [
                UUID().uuidString: "value1",
                key: value,
                UUID().uuidString: "value2"
            ])
            expect(state.valueForKey(key: key)) == value
        }
//
//        it("cannot find a non-existing identity") {
//            let state = DiamondState(facets: [])
//            expect(state.findIdentity(address: identity0.address)).to(beNil())
//        }
//
//        it("finding matches case insensitive") {
//            let state = DiamondState(facets: [identity0])
//            let address = Address(fromHex: identity0.address.value.uppercased())!
//            expect(state.findIdentity(address: address)) == identity0
//        }
    }
}

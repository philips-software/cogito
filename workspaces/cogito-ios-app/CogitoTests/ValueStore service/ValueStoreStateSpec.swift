import Quick
import Nimble
import SwiftyJSON
@testable import Cogito

class ValueStoreStateSpec: QuickSpec {
    override func spec() {
        it("can be encoded and decoded") {
            let key = UUID().uuidString
            let state = ValueStoreState(store: [key: "value"])
            let encoder = JSONEncoder()
            var encodedData: Data!
            expect {
                encodedData = try encoder.encode(state)
                }.toNot(throwError())

            let decoder = JSONDecoder()
            var decodedState: ValueStoreState?
            expect {
                decodedState = try decoder.decode(ValueStoreState.self, from: encodedData)
                }.toNot(throwError())
            expect(decodedState) == state
        }

        it("can retrieve value for the given key") {
            let key = UUID().uuidString
            let value = "some value"
            let state = ValueStoreState(store: [key: value])
            expect(state.valueForKey(key: key)) == value
        }

        it("can retrieve value for the given key when there is more than one value in the store") {
            let key = UUID().uuidString
            let value = "some value"
            let state = ValueStoreState(store: [
                UUID().uuidString: "value1",
                key: value,
                UUID().uuidString: "value2"
            ])
            expect(state.valueForKey(key: key)) == value
        }

        it("simply returns null when there is no requested key in the store") {
            let key = UUID().uuidString
            let value = "some value"
            let state = ValueStoreState(store: [key: value])

            expect(state.valueForKey(key: "doesNotExist")).to(beNil())
        }
    }
}

import Quick
import Nimble
import Geth
@testable import Cogito

class GarbageBinReducerSpec: QuickSpec {
    override func spec() {
        it("allows adding a new key-value pair") {
            let key = "some key"
            let value = "some value"
            let action = GarbageBinActions.Add(key: key, value: value)
            let newState = garbageBinReducer(action: action, state: nil)
            expect(newState.bin.count) == 1
            expect(newState.valueForKey(key: key)) == value
        }

        it("allows adding a another key-value pair") {
            let key = "some key"
            let value = "some value"
            let state = GarbageBinState(bin: [
                "key1": "value1",
                "key2": "value2"
            ])
            let action = GarbageBinActions.Add(key: key, value: value)
            let newState = garbageBinReducer(action: action, state: state)
            expect(newState.bin.count) == 3
            expect(newState.valueForKey(key: key)) == value
            expect(newState.valueForKey(key: "key1")) == "value1"
            expect(newState.valueForKey(key: "key2")) == "value2"
        }

        it("allows deleting existing key value") {
            let key = "some key"
            let value = "some value"
            let state = GarbageBinState(bin: [key: value])
            let action = GarbageBinActions.Delete(key: key)
            let newState = garbageBinReducer(action: action, state: state)
            expect(newState.bin.count) == 0
        }

        it("allows deleting existing key value when store has more than one element") {
            let key = "some key"
            let value = "some value"
            let state = GarbageBinState(bin: [
                "key1": "value1",
                key: value,
                "key2": "value2"
                ])
            let action = GarbageBinActions.Delete(key: key)
            let newState = garbageBinReducer(action: action, state: state)
            expect(newState.bin.count) == 2
            expect(newState.valueForKey(key: "key1")) == "value1"
            expect(newState.valueForKey(key: "key2")) == "value2"
        }
    }
}

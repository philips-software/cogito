import Quick
import Nimble
@testable import Cogito

class ValueStoreReducerSpec: QuickSpec {
    override func spec() {
        it("allows adding a new key-value pair") {
            let key = "some key"
            let value = "some value"
            let action = ValueStoreActions.Add(key: key, value: value)
            let newState = valueStoreReducer(action: action, state: nil)
            expect(newState.store.count) == 1
            expect(newState.valueForKey(key: key)) == value
        }

        it("allows adding a another key-value pair") {
            let key = "some key"
            let value = "some value"
            let state = ValueStoreState(store: [
                "key1": "value1",
                "key2": "value2"
            ])
            let action = ValueStoreActions.Add(key: key, value: value)
            let newState = valueStoreReducer(action: action, state: state)
            expect(newState.store.count) == 3
            expect(newState.valueForKey(key: key)) == value
            expect(newState.valueForKey(key: "key1")) == "value1"
            expect(newState.valueForKey(key: "key2")) == "value2"
        }

        it("allows deleting existing key value") {
            let key = "some key"
            let value = "some value"
            let state = ValueStoreState(store: [key: value])
            let action = ValueStoreActions.Delete(key: key)
            let newState = valueStoreReducer(action: action, state: state)
            expect(newState.store.count) == 0
        }

        it("allows deleting existing key value when store has more than one element") {
            let key = "some key"
            let value = "some value"
            let state = ValueStoreState(store: [
                "key1": "value1",
                key: value,
                "key2": "value2"
                ])
            let action = ValueStoreActions.Delete(key: key)
            let newState = valueStoreReducer(action: action, state: state)
            expect(newState.store.count) == 2
            expect(newState.valueForKey(key: "key1")) == "value1"
            expect(newState.valueForKey(key: "key2")) == "value2"
        }
    }
}

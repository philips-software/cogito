import Quick
import Nimble
@testable import Cogito

class CreateIdentityReducerSpec: QuickSpec {
    override func spec() {
        it("handles SetDescription") {
            let action = CreateIdentityActions.SetDescription(description: "me")
            let state = createIdentityReducer(action: action, state: nil)
            expect(state.description) == "me"
        }

        it("handles Reset") {
            let state = CreateIdentityState(description: "me",
                                            pending: true,
                                            newAddress: Address.example,
                                            error: "some error")
            let action = CreateIdentityActions.ResetForm()
            let nextState = createIdentityReducer(action: action, state: state)
            expect(nextState.description) == ""
            expect(nextState.pending).to(beFalse())
            expect(nextState.newAddress).to(beNil())
            expect(nextState.error).to(beNil())
        }

        it("handles Pending") {
            let state = CreateIdentityState(description: "me",
                                            pending: false,
                                            newAddress: Address.example,
                                            error: "some error")
            let action = CreateIdentityActions.Pending()
            let nextState = createIdentityReducer(action: action, state: state)
            expect(nextState.pending).to(beTrue())
            expect(nextState.newAddress).to(beNil())
            expect(nextState.error).to(beNil())
        }

        it("handles Fulfilled") {
            let state = CreateIdentityState(description: "me",
                                            pending: true,
                                            newAddress: nil,
                                            error: nil)
            let address = Address.example
            let action = CreateIdentityActions.Fulfilled(address: address)
            let nextState = createIdentityReducer(action: action, state: state)
            expect(nextState.pending).to(beFalse())
            expect(nextState.newAddress) == address
        }

        it("handles Rejected") {
            let state = CreateIdentityState(description: "me",
                                            pending: true,
                                            newAddress: nil,
                                            error: nil)
            let error = "some error"
            let action = CreateIdentityActions.Rejected(message: error)
            let nextState = createIdentityReducer(action: action, state: state)
            expect(nextState.pending).to(beFalse())
            expect(nextState.error) == error
        }
    }
}

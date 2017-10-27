//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class TelepathReducerSpec: QuickSpec {
    override func spec() {
        let channel = TelepathChannel.example

        it("stores the channel in the state") {
            let action = TelepathActions.ConnectFulfilled(channel: channel)
            let nextState = telepathReducer(action, nil)
            expect(nextState.channel) == channel
        }

        it("stores connection errors in the state") {
            struct SomeError: Error {}
            let error = SomeError()
            let action = TelepathActions.ConnectRejected(error: error)
            let nextState = telepathReducer(action, nil)
            expect(nextState.connectionError) == error.localizedDescription
        }
    }
}

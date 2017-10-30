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
            let error = ExampleError(message: "an error")
            let action = TelepathActions.ConnectRejected(error: error)
            let nextState = telepathReducer(action, nil)
            expect(nextState.connectionError) == error.localizedDescription
        }

        it("stores received messages in the state") {
            let message = "a message"
            let action = TelepathActions.ReceiveFulfilled(message: message)
            let nextState = telepathReducer(action, nil)
            expect(nextState.receivedMessages) == [message]
        }

        it("stores error while receiving in state") {
            let error = ExampleError(message: "an error")
            let action = TelepathActions.ReceiveRejected(error: error)
            let nextState = telepathReducer(action, nil)
            expect(nextState.receiveError) == error.localizedDescription
        }
    }
}

//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
@testable import Cogito

class TelepathReducerSpec: QuickSpec {
    override func spec() {
        let channel = TelepathChannel.example
        let identity = Identity.example
        let message = TelepathMessage(message: "a message", channel: channel)

        it("stores the channel in the state") {
            let action = TelepathActions.ConnectFulfilled(channel: channel, identity: identity)
            let nextState = telepathReducer(action, nil)
            expect(nextState.channels[channel]) == identity.identifier
        }

        it("stores connection errors in the state") {
            let error = ExampleError(message: "an error")
            let action = TelepathActions.ConnectRejected(error: error, identity: identity)
            let nextState = telepathReducer(action, nil)
            expect(nextState.connectionError) == error.localizedDescription
        }

        it("stores received messages in the state") {
            let action = TelepathActions.ReceiveFulfilled(message: message.message, channel: channel)
            let nextState = telepathReducer(action, nil)
            expect(nextState.receivedMessages) == [message]
        }

        it("stores error while receiving in state") {
            let error = ExampleError(message: "an error")
            let action = TelepathActions.ReceiveRejected(error: error, channel: channel)
            let nextState = telepathReducer(action, nil)
            expect(nextState.receiveError) == error.localizedDescription
        }

        it("removes handled messages from state") {
            let state = TelepathState(receivedMessages: [message])
            let action = TelepathActions.ReceivedMessageHandled()
            let nextState = telepathReducer(action, state)
            expect(nextState.receivedMessages) == []
        }
    }
}

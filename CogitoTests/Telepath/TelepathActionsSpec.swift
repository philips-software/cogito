//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class TelepathActionsSpec: QuickSpec {
    override func spec() {
        describe("connection") {
            let connectUrl = URL(
                string: "https://cogito.example.com/telepath/connect#I=1234&E=abcd"
            )!

            it("connects to a channel") {
                let recorder = DispatchRecorder<TelepathActions.ConnectFulfilled>()
                let action = TelepathActions.Connect(url: connectUrl)
                action.action(recorder.dispatch, { return nil })
                expect(recorder.count) == 1
            }

            it("reports an error when connecting to a channel fails") {
                let recorder = DispatchRecorder<TelepathActions.ConnectRejected>()
                let action = TelepathActions.Connect(url: URL(string: "http://invalid")!)
                action.action(recorder.dispatch, { return nil })
                expect(recorder.count) == 1
            }
        }

        describe("receiving") {
            var state: AppState!
            var channel: TelepathChannelSpy!

            beforeEach {
                channel = TelepathChannelSpy()
                state = appState(telepath: TelepathState(channel: channel))
            }

            it("receives messages") {
                let recorder = DispatchRecorder<TelepathActions.ReceiveFulfilled>()
                let message = "a message"
                channel.receiveMessage = message

                let action = TelepathActions.Receive()
                action.action(recorder.dispatch, { return state })

                expect(recorder.actions.last?.message)
                    .toEventually(equal(message))
            }

            it("reports errors while receiving") {
                let recorder = DispatchRecorder<TelepathActions.ReceiveRejected>()
                let error = ExampleError(message: "an error")
                channel.receiveError = error

                let action = TelepathActions.Receive()
                action.action(recorder.dispatch, { return state })

                expect(recorder.actions.last?.error as? ExampleError)
                    .toEventually(equal(error))
            }
        }
    }
}

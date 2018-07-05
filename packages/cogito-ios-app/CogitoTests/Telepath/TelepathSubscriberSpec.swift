//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class TelepathSubscriberSpec: QuickSpec {
    override func spec() {
        var subscriber: TelepathSubscriber!
        var store: RecordingStore!
        let exampleChannel = TelepathChannel.example

        beforeEach {
            store = RecordingStore()
            subscriber = TelepathSubscriber(store: store)
        }

        describe("subscribe/unsubscribe") {
            var newStateReceived = false

            beforeEach {
                newStateReceived = false
                subscriber.onNewState = { _ in return { _ in
                    newStateReceived = true
                }}
            }

            it("subscribes to changes to the telepath channel") {
                subscriber.start()
                store.dispatch(TracerAction())
                expect(newStateReceived).to(beTrue())
            }

            it("unsubscribes") {
                subscriber.stop()
                store.dispatch(TracerAction())
                expect(newStateReceived).to(beFalse())
            }
        }

        describe("incoming JSON RPC requests") {
            let message = "{" +
                "\"jsonrpc\":\"2.0\"," +
                "\"id\":42," +
                "\"method\":\"test\"" +
            "}"

            var service1: ServiceSpy!
            var service2: ServiceSpy!

            beforeEach {
                service1 = ServiceSpy()
                service2 = ServiceSpy()
                subscriber.addService(service1)
                subscriber.addService(service2)
                let telepathMessage = TelepathMessage(message: message, channel: exampleChannel)
                subscriber.newState(state: [telepathMessage])
            }

            it("notifies subscribed services") {
                let request = JsonRpcRequest(parse: message)
                expect(service1.latestRequest) == request
                expect(service2.latestRequest) == request
            }

            it("signals that the message has been handled") {
                expect(store.actions).to(containElementSatisfying({
                    $0 is TelepathActions.ReceivedMessageHandled
                }))
            }
        }

        context("when an invalid JSON RPC request is received") {
            beforeEach {
                subscriber.newState(state: [
                    TelepathMessage(message: "invalid request", channel: exampleChannel)
                ])
            }

            it("ignores the message and signals that it has been handled") {
                expect(store.actions).to(containElementSatisfying({
                    $0 is TelepathActions.ReceivedMessageHandled
                }))
            }
        }

        context("when there are no messages waiting") {
            beforeEach {
                subscriber.newState(state: [])
            }

            it("does nothing") {
                expect(store.actions).toNot(containElementSatisfying({
                    $0 is TelepathActions.ReceivedMessageHandled
                }))
            }
        }
    }
}

class ServiceSpy: TelepathService {
    var latestRequest: JsonRpcRequest?
    var latestChannel: TelepathChannel?

    func onRequest(_ request: JsonRpcRequest, on channel: TelepathChannel) {
        latestRequest = request
        latestChannel = channel
    }
}

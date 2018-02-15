//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class TelepathSubscriberSpec: QuickSpec {
    override func spec() {
        var subscriber: TelepathSubscriber!
        var store: StoreSpy!

        beforeEach {
            store = StoreSpy()
            subscriber = TelepathSubscriber(store: store)
        }

        it("subscribes to incoming Telepath messages") {
            subscriber.start()
            expect(store.latestSubscriber) === subscriber
        }

        it("unsubscribes") {
            subscriber.stop()
            expect(store.latestUnsubscriber) === subscriber
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
                subscriber.newState(state: [message])
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
                subscriber.newState(state: ["invalid request"])
            }

            it("ignores the message and signals that it has been handled") {
                expect(store.actions).to(containElementSatisfying({
                    $0 is TelepathActions.ReceivedMessageHandled
                }))
            }
        }
    }
}

class ServiceSpy: TelepathService {
    var latestRequest: JsonRpcRequest?

    func onRequest(_ request: JsonRpcRequest) {
        latestRequest = request
    }
}

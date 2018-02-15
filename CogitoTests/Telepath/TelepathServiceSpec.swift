//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwift

class TelepathServiceSpec: QuickSpec {
    override func spec() {
        var service: TestableService!
        var store: StoreSpy!

        beforeEach {
            store = StoreSpy()
            service = TestableService(store: store, method: "test")
        }

        it("subscribes to incoming Telepath messages") {
            service.start()
            expect(store.latestSubscriber) === service
        }

        it("unsubscribes") {
            service.stop()
            expect(store.latestUnsubscriber) === service
        }

        describe("incoming messages") {
            let testRequest = "{\"method\":\"test\"}"
            let otherRequest = "{\"method\":\"other\"}"

            func whenReceiving(messages: [String]) {
                beforeEach {
                    service.newState(state: messages)
                }
            }

            func itCallsOnMessage() {
                it("calls the onMessage method") {
                    expect(service.latestMessage) == testRequest
                }
            }

            func itDoesNotCallOnMessage() {
                it("does not call the onMessage method") {
                    expect(service.latestMessage).to(beNil())
                }
            }

            func itHandlesTheMessage() {
                it("handles the message") {
                    expect(store.actions).to(containElementSatisfying({
                        $0 is TelepathActions.ReceivedMessageHandled
                    }))
                }
            }

            context("when an expected requests comes in") {
                whenReceiving(messages: [testRequest])
                itHandlesTheMessage()
                itCallsOnMessage()
            }

            context("when a different request comes in") {
                whenReceiving(messages: [otherRequest])
                itDoesNotCallOnMessage()
            }

            context("when the list of messages is empty") {
                whenReceiving(messages: [])
                itDoesNotCallOnMessage()
            }

            context("when the expected request is not the oldest message") {
                whenReceiving(messages: [otherRequest, testRequest])
                itDoesNotCallOnMessage()
            }
        }
    }
}

private class TestableService: TelepathService {
    var latestMessage: String?

    override func onMessage(_ message: String) {
        latestMessage = message
    }
}

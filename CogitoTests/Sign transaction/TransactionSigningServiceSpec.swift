//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwiftThunk

class TransactionSigningServiceSpec: QuickSpec {
    override func spec() {
        var service: TransactionSigningService!
        var store: StoreSpy!

        beforeEach {
            store = StoreSpy()
            service = TransactionSigningService(store: store)
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
            let signRequest = "{\"method\":\"signTransaction\",\"params\":{}}"
            let otherRequest = "{\"method\":\"other\"}"

            func whenReceiving(messages: [String]) {
                beforeEach {
                    service.newState(state: messages)
                }
            }

            func itDispatchesSignTransaction() {
                it("dispatches the SignTransaction action") {
                    expect(store.actions.last as? ThunkAction<AppState>)
                        .toNot(beNil())
                }
            }

            func itDoesNotDispatchSignTransaction() {
                it("does not dispatch the GetAccount action") {
                    expect(store.actions.last as? ThunkAction<AppState>)
                        .to(beNil())
                }
            }

            func itHandlesTheMessage() {
                it("handles the message") {
                    expect(store.actions).to(containElementSatisfying({
                        $0 is TelepathActions.ReceivedMessageHandled
                    }))
                }
            }

            context("when an sign requests comes in") {
                whenReceiving(messages: [signRequest])
                itHandlesTheMessage()
                itDispatchesSignTransaction()
            }

            context("when a different request comes in") {
                whenReceiving(messages: [otherRequest])
                itDoesNotDispatchSignTransaction()
            }

            context("when the list of messages is empty") {
                whenReceiving(messages: [])
                itDoesNotDispatchSignTransaction()
            }

            context("when the account request is not the oldest message") {
                whenReceiving(messages: [otherRequest, signRequest])
                itDoesNotDispatchSignTransaction()
            }
        }
    }
}

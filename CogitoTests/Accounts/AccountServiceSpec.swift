//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwiftThunk

class AccountServiceSpec: QuickSpec {
    override func spec() {
        var service: AccountService!
        var store: StoreSpy!

        beforeEach {
            store = StoreSpy()
            service = AccountService(store: store)
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
            let accountRequest = "{\"method\":\"accounts\"}"
            let otherRequest = "{\"method\":\"other\"}"

            func whenReceiving(messages: [String]) {
                beforeEach {
                    service.newState(state: messages)
                }
            }

            func itDispatchesGetAccounts() {
                it("dispatches the GetAccounts action") {
                    expect(store.actions.last as? ThunkAction<AppState>)
                        .toNot(beNil())
                }
            }

            func itDoesNotDispatchGetAccounts() {
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

            context("when an account requests comes in") {
                whenReceiving(messages: [accountRequest])
                itHandlesTheMessage()
                itDispatchesGetAccounts()
            }

            context("when a different request comes in") {
                whenReceiving(messages: [otherRequest])
                itDoesNotDispatchGetAccounts()
            }

            context("when the list of messages is empty") {
                whenReceiving(messages: [])
                itDoesNotDispatchGetAccounts()
            }

            context("when the account request is not the oldest message") {
                whenReceiving(messages: [otherRequest, accountRequest])
                itDoesNotDispatchGetAccounts()
            }
        }
    }
}

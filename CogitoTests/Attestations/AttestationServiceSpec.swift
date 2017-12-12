//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwiftThunk

class AttestationServiceSpec: QuickSpec {
    override func spec() {
        var service: AttestationService!
        var store: StoreSpy!

        beforeEach {
            store = StoreSpy()
            service = AttestationService(store: store)
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
            let realmUrl = "https://iam-blockchain-dev.cogito.mobi/auth/realms/master"
            let attestationsRequest = "{\"method\":\"attestations\"," +
                                      "\"realmUrl\":\"\(realmUrl)\"}"
            let otherRequest = "{\"method\":\"other\"}"

            func whenReceiving(messages: [String]) {
                beforeEach {
                    service.newState(state: messages)
                }
            }

            func itDispatchesGetAttestations() {
                it("dispatches the GetAttestations action") {
                    expect(store.actions.last as? ThunkAction<AppState>)
                        .toNot(beNil())
                }
            }

            func itDoesNotDispatchGetAttestations() {
                it("does not dispatch the GetAttestations action") {
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

            context("when an attestations requests comes in") {
                whenReceiving(messages: [attestationsRequest])
                itHandlesTheMessage()
                itDispatchesGetAttestations()
            }

            context("when a different request comes in") {
                whenReceiving(messages: [otherRequest])
                itDoesNotDispatchGetAttestations()
            }

            context("when the list of messages is empty") {
                whenReceiving(messages: [])
                itDoesNotDispatchGetAttestations()
            }

            context("when the attestations request is not the oldest message") {
                whenReceiving(messages: [otherRequest, attestationsRequest])
                itDoesNotDispatchGetAttestations()
            }
        }
    }
}

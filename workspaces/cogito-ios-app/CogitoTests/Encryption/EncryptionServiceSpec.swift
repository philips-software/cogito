//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class EncryptionServiceSpec: QuickSpec {
    override func spec() {
        var service: EncryptionService!
        var store: RecordingStore!
        var channel: TelepathChannel!
        let identity = Identity(description: "example", address: Address.testAddress)

        beforeEach {
            store = RecordingStore()
            service = EncryptionService(store: store)
            channel = TelepathChannel.example
            store.state = appState(telepath: TelepathState(channels: [channel: identity]))
        }

        context("when a matching request comes in") {
            beforeEach {
                let request = JsonRpcRequest(
                    id: JsonRpcId(1),
                    method: "createEncryptionKeyPair",
                    params: JsonRpcParams()
                )
                service.onRequest(request, on: channel)
            }

            it("dispatches CreateEncryptionKeyPair action") {
                let action = store.firstAction(ofType: DiamondActions.CreateEncryptionKeyPair.self)
                expect(action).toNot(beNil())
            }

            it("uses the identity that is associated with the channel") {
                let action = store.firstAction(ofType: DiamondActions.CreateEncryptionKeyPair.self)
                expect(action?.identity) == store.state.telepath.channels[channel]
            }
        }
    }
}

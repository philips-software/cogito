// Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import ReSwift

struct EncryptionService: TelepathService {
    let store: Store<AppState>
    var publicKeyLoader: ((String) -> PublicKey?)!

    init(store: Store<AppState>) {
        self.store = store
        self.publicKeyLoader = loadPublicKeyFromKeychain
    }

    func onRequest(_ request: JsonRpcRequest, on channel: TelepathChannel) {
        if let identity = store.state.telepath.channels[channel] {
            switch request.method {
            case "createEncryptionKeyPair":
                createKeyPair(request: request, identity: identity, channel: channel)
            case "getEncryptionPublicKey":
                requestPublicKey(request: request, identity: identity, channel: channel)
            default:
                break
            }
        }
    }

    private func createKeyPair(request: JsonRpcRequest, identity: Identity, channel: TelepathChannel) {
        let createKeyPairAction = DiamondActions.CreateEncryptionKeyPair(identity: identity)
        store.dispatch(createKeyPairAction)
        store.dispatch(TelepathActions.Send(
            id: request.id,
            result: createKeyPairAction.tag,
            on: channel
        ))
    }

    private func requestPublicKey(request: JsonRpcRequest, identity: Identity, channel: TelepathChannel) {
        let publicKey = publicKeyLoader?(request.params["tag"].stringValue)
        store.dispatch(TelepathActions.Send(id: request.id, result: publicKey!, on: channel))
    }

    private func loadPublicKeyFromKeychain(tag: String) -> PublicKey? {
        assert(false, "to be implemented")
        return nil
    }

    typealias PublicKey = Data
}

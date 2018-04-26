// Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import ReSwift

struct EncryptionService: TelepathService {
    let store: Store<AppState>
    var keyPairCreator: KeyPairCreatorType = KeyPairCreator()
    var publicKeyLoader: PublicKeyLoaderType = PublicKeyLoader()
    var decrypter: DecrypterType = Decrypter()

    init(store: Store<AppState>) {
        self.store = store
    }

    func onRequest(_ request: JsonRpcRequest, on channel: TelepathChannel) {
        if
            let identityReference = store.state.telepath.channels[channel],
            let identity = store.state.diamond.facets[identityReference]
        {
            switch request.method {
            case "createEncryptionKeyPair":
                createKeyPair(request: request, identity: identity, channel: channel)
            case "getEncryptionPublicKey":
                requestPublicKey(request: request, identity: identity, channel: channel)
            case "decrypt":
                decrypt(request: request, identity: identity, channel: channel)
            default:
                break
            }
        }
    }

    private func createKeyPair(request: JsonRpcRequest, identity: Identity, channel: TelepathChannel) {
        let tag = UUID().uuidString
        keyPairCreator.create(tag: tag)
        store.dispatch(DiamondActions.StoreEncryptionKeyPair(identity: identity, tag: tag))
        store.dispatch(TelepathActions.Send(id: request.id, result: tag, on: channel))
    }

    private func requestPublicKey(request: JsonRpcRequest, identity: Identity, channel: TelepathChannel) {
        guard let tag = request.params["tag"].string else {
            store.dispatch(TelepathActions.Send(id: request.id, error: EncryptionError.tagMissing, on: channel))
            return
        }

        guard identity.encryptionKeyPairs.contains(tag), let publicKey = publicKeyLoader.loadJsonWebKey(tag: tag) else {
            store.dispatch(TelepathActions.Send(id: request.id, error: EncryptionError.keyNotFound, on: channel))
            return
        }

        store.dispatch(TelepathActions.Send(id: request.id, result: publicKey, on: channel))
    }

    private func decrypt(request: JsonRpcRequest, identity: Identity, channel: TelepathChannel) {
        guard let tag = request.params["tag"].string else {
            store.dispatch(TelepathActions.Send(id: request.id, error: EncryptionError.tagMissing, on: channel))
            return
        }

        guard let cipherTextHex = request.params["cipherText"].string else {
            store.dispatch(TelepathActions.Send(id: request.id, error: EncryptionError.cipherTextMissing, on: channel))
            return
        }

        guard let cipherText = Data(fromHex: cipherTextHex) else {
            store.dispatch(TelepathActions.Send(id: request.id, error: EncryptionError.cipherTextInvalid, on: channel))
            return
        }

        guard
            identity.encryptionKeyPairs.contains(tag),
            let plainText = decrypter.decrypt(keyTag: tag, cipherText: cipherText) else
        {
            store.dispatch(TelepathActions.Send(id: request.id, error: EncryptionError.decryptionFailed, on: channel))
            return
        }

        store.dispatch(TelepathActions.Send(id: request.id, result: plainText, on: channel))
    }
}

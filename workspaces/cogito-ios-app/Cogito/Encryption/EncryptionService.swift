//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import ReSwift

struct EncryptionService: TelepathService {
    let store: Store<AppState>
    func onRequest(_ request: JsonRpcRequest, on channel: TelepathChannel) {
        guard request.method == "createEncryptionKeyPair" else { return }

        if let identity = store.state.telepath.channels[channel] {
            let createKeyPairAction = DiamondActions.CreateEncryptionKeyPair(identity: identity)
            store.dispatch(createKeyPairAction)
            store.dispatch(TelepathActions.Send(
                id: request.id,
                result: createKeyPairAction.tag,
                on: channel
            ))
        }
    }
}

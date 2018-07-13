import Foundation
import ReSwift

struct IdentityInfoService: TelepathService {
    let store: Store<AppState>

    init(store: Store<AppState>) {
        self.store = store
    }

    func onRequest(_ request: JsonRpcRequest, on channel: TelepathChannel) {
        if let identityReference = store.state.telepath.channels[channel],
           let identity = store.state.diamond.facets[identityReference] {
            switch request.method {
            case "getIdentityInfo":
                getIdentityInfo(request: request, identity: identity, channel: channel)
            default:
                break
            }
        }
    }

    private func getIdentityInfo(request: JsonRpcRequest, identity: Identity, channel: TelepathChannel) {
        var identityInfo: [String: Any] = [:]
        guard let params = request.params.dictionaryObject,
              let requestedProperties = params["properties"] as? [String] else {
            return
        }
        for prop in requestedProperties {
            switch prop {
            case "username":
                identityInfo[prop] = identity.description
            case "ethereumAddress":
                identityInfo[prop] = identity.address.value
            default:
                break
            }
        }
        store.dispatch(TelepathActions.Send(id: request.id, result: identityInfo, on: channel))
    }
}

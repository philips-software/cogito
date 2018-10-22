import ReSwift
import Geth

func diamondReducer(action: Action, state: DiamondState?) -> DiamondState {
    var state = state ?? initialDiamondState
    switch action {
    case let createFacet as DiamondActions.CreateFacet:
        var newFacets = state.facets
        let gethAddress = createFacet.account.getAddress()!
        let identity = Identity(description: createFacet.description,
                                address: Address(from: gethAddress))
        newFacets[identity.identifier] = identity
        state.facets = newFacets
        if state.selectedFacetId == nil {
            state.selectedFacetId = identity.identifier
        }
    case let deleteFacet as DiamondActions.DeleteFacet:
        var newFacets = state.facets
        let removedFacet = newFacets.removeValue(forKey: deleteFacet.uuid)
        state.facets = newFacets
        if let removedFacetId = removedFacet?.identifier, state.selectedFacetId == removedFacetId {
            state.selectedFacetId = nil
        }
    case let action as DiamondActions.StoreOpenIDAttestation:
        let attestation = Attestation(oidcToken: action.idToken)
        state.facets[action.identity.identifier]?.attestations.append(attestation)
    case let action as DiamondActions.StoreAttestation:
        state.facets[action.identity.identifier]?.attestations.append(action.attestation)
    case let action as DiamondActions.SelectFacet:
        if state.facets[action.uuid] != nil {
            state.selectedFacetId = action.uuid
        }
    case let action as DiamondActions.StoreEncryptionKeyPair:
        state.facets[action.identity.identifier]?.encryptionKeyPairs.append(action.tag)
    default:
        break
    }
    return state
}

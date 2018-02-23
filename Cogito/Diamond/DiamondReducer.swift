//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

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
    case let action as DiamondActions.AddJWTAttestation:
        state.facets[action.identity.identifier]?.idTokens.append(action.idToken)
    case let action as DiamondActions.SelectFacet:
        if state.facets[action.uuid] != nil {
            state.selectedFacetId = action.uuid
        }
    default:
        break
    }
    return state
}

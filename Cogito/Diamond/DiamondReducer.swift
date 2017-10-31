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
        if state.selectedFacet == nil {
            state.selectedFacet = identity.identifier
        }
    default:
        break
    }
    return state
}

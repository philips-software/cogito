//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import Geth

func diamondReducer(action: Action, state: DiamondState?) -> DiamondState {
    var state = state ?? initialDiamondState
    switch action {
    case let createFacet as DiamondActions.CreateFacet:
        var newFacets = state.facets
        let identity = Identity(description: createFacet.description,
                                gethAddress: createFacet.account.getAddress()!)
        newFacets.append(identity)
        state.facets = newFacets
        if state.selectedFacet < 0 {
            state.selectedFacet = 0
        }
    default:
        break
    }
    return state
}

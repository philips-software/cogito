//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import Geth

func diamondReducer(action: Action, state: DiamondState?) -> DiamondState {
    var state = state ?? initialDiamondState
    switch action {
    case let createIdentityFulfilled as CreateIdentityActions.Fulfilled:
        var newFacets = state.facets
        let identity = Identity(description: "",
                                gethAddress: createIdentityFulfilled.account.getAddress()!)
        newFacets.append(identity)
        state.facets = newFacets
    default:
        break
    }
    return state
}

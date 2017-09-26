//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import ReSwift

func gethReducer(action: Action, state: GethState?) -> GethState {
    let state = state ?? initialGethState
    return state
}

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct DiamondState: Codable {
    let facets: [Identity]

    init(facets: [Identity]) {
        self.facets = facets
    }
}

extension DiamondState: Equatable {
    static func == (lhs: DiamondState, rhs: DiamondState) -> Bool {
        return lhs.facets == rhs.facets
    }
}

let initialDiamondState = DiamondState(facets: [])

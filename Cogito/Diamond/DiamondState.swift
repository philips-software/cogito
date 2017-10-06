//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct DiamondState: Codable {
    var facets: [Identity]
    var selectedFacet: Int

    init(facets: [Identity]) {
        self.facets = facets
        selectedFacet = facets.count > 0 ? 0 : -1
    }
}

extension DiamondState: Equatable {
    static func == (lhs: DiamondState, rhs: DiamondState) -> Bool {
        return lhs.facets == rhs.facets
    }
}

let initialDiamondState = DiamondState(facets: [])

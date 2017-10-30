//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct DiamondState: Codable {
    var facets: [UUID: Identity]
    var selectedFacet: UUID?

    init(facets: [UUID: Identity]) {
        self.facets = facets
        selectedFacet = facets.values.first?.identifier
    }

    init(facets: [Identity]) {
        let facetsWithIdentifiers = facets.map { ($0.identifier, $0) }
        self.init(facets: [UUID: Identity](uniqueKeysWithValues: facetsWithIdentifiers))
    }
}

extension DiamondState: Equatable {
    static func == (lhs: DiamondState, rhs: DiamondState) -> Bool {
        return lhs.facets == rhs.facets && lhs.selectedFacet == rhs.selectedFacet
    }
}

let initialDiamondState = DiamondState(facets: [:])

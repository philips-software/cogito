//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct DiamondState: Codable {
    var facets: [UUID: Identity]
    var selectedFacetId: UUID?

    init(facets: [UUID: Identity]) {
        self.facets = facets
        selectedFacetId = facets.values.first?.identifier
    }

    init(facets: [Identity]) {
        let facetsWithIdentifiers = facets.map { ($0.identifier, $0) }
        self.init(facets: [UUID: Identity](uniqueKeysWithValues: facetsWithIdentifiers))
    }

    func selectedFacet() -> Identity? {
        guard let facetId = selectedFacetId else { return nil }
        return facets[facetId]
    }

    func findIdentity(address: Address) -> Identity? {
        return facets.values.first { $0.address == address }
    }
}

extension DiamondState: Equatable {
    static func == (lhs: DiamondState, rhs: DiamondState) -> Bool {
        return lhs.facets == rhs.facets && lhs.selectedFacetId == rhs.selectedFacetId
    }
}

let initialDiamondState = DiamondState(facets: [:])

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct DiamondState: Codable {
    let facets: [Identity]

    init() {
        facets = []
    }

    init(from decoder: Decoder) throws {
        facets = []
    }

    func encode(to encoder: Encoder) throws {

    }
}

let initialDiamondState = DiamondState()

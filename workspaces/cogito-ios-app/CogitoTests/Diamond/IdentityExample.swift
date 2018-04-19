//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

@testable import Cogito

extension Identity {
    static var example: Identity {
        return Identity(description: "Example Identity", address: Address.testAddress)
    }
}

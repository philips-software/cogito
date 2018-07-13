@testable import Cogito

extension Identity {
    static var example: Identity {
        return Identity(description: "Example Identity", address: Address.testAddress)
    }
}

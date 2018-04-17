//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

struct PublicKeyLoader: PublicKeyLoaderType {
    func load(tag: String) -> PublicKey? {
        assert(false, "to be implemented")
        return nil
    }
}

protocol PublicKeyLoaderType {
    typealias PublicKey = Data

    func load(tag: String) -> PublicKey?
}

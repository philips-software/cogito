//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

struct Decrypter: DecrypterType {
    func decrypt(keyTag: String, cipherText: Data) -> Data? {
        assert(false, "not implemented yet")
        return nil
    }
}

protocol DecrypterType {
    func decrypt(keyTag: String, cipherText: Data) -> Data?
}

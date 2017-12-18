//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

extension JSONDecoder {
    func decode<T>(_ type: T.Type, from string: String) throws -> T where T: Decodable {
        let data = string.data(using: .utf8)!
        return try decode(type, from: data)
    }
}

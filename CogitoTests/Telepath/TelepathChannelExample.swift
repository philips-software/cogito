//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

extension TelepathChannel {
    static var example: TelepathChannel {
        return try! TelepathChannel(
            queuingServiceUrl: URL(string: "https://telepath.example.com")!,
            connectUrl: URL(string: "https://cogito.example.com/telepath/connect#I=1234&E=abcd")!
        )
    }
}

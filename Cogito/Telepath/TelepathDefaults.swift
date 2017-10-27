//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Telepath

extension Telepath {
    init() {
        self.init(queuingServiceUrl: URL(string: "https://telepath.cogito.mobi")!)
    }
}

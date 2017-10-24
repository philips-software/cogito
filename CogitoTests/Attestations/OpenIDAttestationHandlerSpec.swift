//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class OpenIDAttestationHandlerSpec: QuickSpec {
    override func spec() {
        it("requests openid configuration") {
            let url = URL(string: "https://example.com/realms/master")!
            let handler = OpenIDAttestationHandler(oidcRealmUrl: url, onSuccess: { _ in }, onError: { _ in })
        }
    }
}

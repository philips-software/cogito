//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class TelepathReducerSpec: QuickSpec {
    override func spec() {
        let connectUrl = URL(string: "https://cogito.example.com/#I=1234&E=abcd")!

        it("stores the connect url in the state") {
            let action = TelepathActions.Connect(url: connectUrl)
            let nextState = telepathReducer(action, nil)
            expect(nextState.connectUrl) == connectUrl
        }
    }
}

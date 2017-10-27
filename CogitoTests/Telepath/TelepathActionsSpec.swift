//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class TelepathActionsSpec: QuickSpec {
    override func spec() {
        let connectUrl = URL(
            string: "https://cogito.example.com/telepath/connect#I=1234&E=abcd"
        )!

        it("connects to a channel") {
            let recorder = DispatchRecorder<TelepathActions.Connected>()
            let action = TelepathActions.Connect(url: connectUrl)
            action.action(recorder.dispatch, { return nil })
            expect(recorder.count) == 1
        }

        it("reports an error when connecting to a channel fails") {
            let recorder = DispatchRecorder<TelepathActions.ConnectionFailed>()
            let action = TelepathActions.Connect(url: URL(string: "http://invalid")!)
            action.action(recorder.dispatch, { return nil })
            expect(recorder.count) == 1
        }
    }
}

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import Foundation
import ReSwiftThunk

class LaunchActionsSpec: QuickSpec {
    override func spec() {
        it("can parse URI fragment") {
            let fragment = "a=b&c=d"
            let parsed = LaunchActions.parse(fragment: fragment)!
            expect(parsed.count) == 2
            expect(parsed["a"]) == "b"
            expect(parsed["c"]) == "d"
        }

        it("cannot parse invalid URI fragments") {
            expect(LaunchActions.parse(fragment: "x")).to(beNil())
        }

        it("dispatches AttestationActions.FinishRejected if no token present") {
            let params: [String:AnyObject] = [
                "~referring_link": "https://cogito.app.link/bHwkY7KrvH#not-before-policy=0" as NSString
            ]
            // swiftlint:disable:next force_cast
            let startAction = LaunchActions.create(forBranchParams: params)! as! ThunkAction<AppState>
            let dispatchRecorder = DispatchRecorder<AttestationActions.FinishRejected>()
            startAction.action(dispatchRecorder.dispatch, { return nil })
            expect(dispatchRecorder.count) == 1
        }

        it("dispatches AttestationActions.Fulfilled action") {
            let params: [String:AnyObject] = [
                "~referring_link": "https://cogito.app.link/bHwkY7KrvH#id_token=token&not-before-policy=0" as NSString
            ]
            // swiftlint:disable:next force_cast
            let startAction = LaunchActions.create(forBranchParams: params)! as! ThunkAction<AppState>
            let dispatchRecorder = DispatchRecorder<AttestationActions.Fulfilled>()
            startAction.action(dispatchRecorder.dispatch, { return nil })
            expect(dispatchRecorder.count) == 1
            expect(dispatchRecorder.actions[0].idToken) == "token"
        }
    }
}

//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble

class GethReducerSpec: QuickSpec {
    override func spec() {
        it("handles peers updated") {
            let action = PeersUpdated(count: 42)
            let state = gethReducer(action: action, state: nil)
            expect(state.peersCount) == 42
        }

        it("handles sync progress updated") {
            let syncProgress = SyncProgress(start: 0, current: 0, total: 0)
            let action = SyncProgressUpdated(progress: syncProgress)
            let state = gethReducer(action: action, state: nil)
            expect(state.syncProgress) == syncProgress
        }

        it("handles sync progress when it is nil") {
            let action = SyncProgressUpdated(progress: nil)
            let state = gethReducer(action: action, state: nil)
            expect(state.syncProgress).to(beNil())
        }
    }
}

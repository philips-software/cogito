//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import Geth
@testable import Cogito

class CreateIdentityStateSpec: QuickSpec {
    override func spec() {
        it("can encode and decode") {
            let account = GethAccount()
            let state = CreateIdentityState(description: "desc",
                                            pending: true,
                                            newAccount: account,
                                            error: "some error")
            let encoder = JSONEncoder()
            var data: Data!
            expect {
                data = try encoder.encode(state)
            }.toNot(throwError())
            let encoded = String(data: data, encoding: .utf8)
            expect(encoded) == "{\"description\":\"desc\"}"

            let decoder = JSONDecoder()
            var state2: CreateIdentityState!
            expect {
                state2 = try decoder.decode(CreateIdentityState.self, from: data)
            }.toNot(throwError())

            expect(state2.description) == state.description
            expect(state2.pending).to(beFalse())
            expect(state2.newAccount).to(beNil())
            expect(state2.error).to(beNil())
        }
    }
}

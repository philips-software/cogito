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

        it("dispatches AttestationActions.Fulfilled action") {
            let token = "eyJhbGciOiJSUzI1NiIsInR5c" +
                        "CIgOiAiSldUIiwia2lkIiA6ICJ0U1huMHQtVV9MWUFnTXZacFM0aF9KQUE5Y1RZWWQ2MX" +
                        "M2aF8zT0dhLXVjIn0.eyJqdGkiOiJlN2NiZmY3Mi1lZDY3LTRkMTUtOGE2MC00NDdhMjl" +
                        "iZGVjMDkiLCJleHAiOjE1MDkwMTEyMjEsIm5iZiI6MCwiaWF0IjoxNTA5MDEwMzIxLCJp" +
                        "c3MiOiJodHRwOi8vZWMyLTM1LTE1OC0yMC0xNjEuZXUtY2VudHJhbC0xLmNvbXB1dGUuY" +
                        "W1hem9uYXdzLmNvbTo4MDgwL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6ImNvZ2l0by" +
                        "IsInN1YiI6IjkzYWIxMjc1LWY3ZTItNGFmNi04YWE5LTRjYzM0YjdiZTMwNyIsInR5cCI" +
                        "6IklEIiwiYXpwIjoiY29naXRvIiwibm9uY2UiOiJhMGViMjkxYjhiYjYwMWVmMDhlNDVm" +
                        "MWZjZWMzNWI3YjMyYWNiNzllNTUyZjY2NjY0YzRhMjUzMzMzMGVlZTcxIiwiYXV0aF90a" +
                        "W1lIjoxNTA5MDEwMzIxLCJzZXNzaW9uX3N0YXRlIjoiMDYyNjFhN2EtMjgyZi00MTEzLT" +
                        "hmYmQtNTFiMzJhMTY5YjI2IiwiYWNyIjoiMSIsIm5hbWUiOiJEZW1vIFVzZXIiLCJwcmV" +
                        "mZXJyZWRfdXNlcm5hbWUiOiJkZW1vIiwiZ2l2ZW5fbmFtZSI6IkRlbW8iLCJmYW1pbHlf" +
                        "bmFtZSI6IlVzZXIiLCJlbWFpbCI6ImRlbW9AZXhhbXBsZS5jb20ifQ.OxBNXYenPWDO93" +
                        "XhNn9wa7thfuPW4hVarQd4ufZHNFKl2iagcByZ95rtGd065u-B5hSpgEcTXtencr2Gf5W" +
                        "mWvQbMvoskyP5DXVtpNTz_hYwbS6ga24f-tr-WKGG6cqJzXEgrsN4P0YJzP6Uv_GIiLU6" +
                        "qucGjpK-pNSN6kJr9IKlQEpow_ERkyVIFaBtuzVT0fi6nfIskKOwzhJwf0eK-VX7o6mJa" +
                        "fzinyXc1wC-rGNb5rtbHbC1qx8Se4-gp-G0EDTa3iChS7m_ZDdXjMmnp22poRv1M8W3Ft" +
                        "rnfAnMyyDxr8AZwTefCQN9-3ge3hmBS7nBjlrrYkmwSTpAlJGHOg"
            let linkString = "https://cogito.app.link/bHwkY7KrvH#id_token=" + token +
                             "&not-before-policy=0"
            let params: [String:AnyObject] = [
                "~referring_link": linkString as NSString
            ]
            // swiftlint:disable:next force_cast
            let startAction = LaunchActions.create(forBranchParams: params)! as! ThunkAction<AppState>
            let dispatchRecorder = DispatchRecorder<AttestationActions.Fulfilled>()
            startAction.action(dispatchRecorder.dispatch, { return nil })
            expect(dispatchRecorder.count) == 1
            expect(dispatchRecorder.actions[0].idToken) == token
        }
    }
}

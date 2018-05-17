//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
@testable import Cogito

class IdentitySpec: QuickSpec {
    override func spec() {
        var identity: Identity!

        beforeEach {
            identity = Identity.example
        }

        it("cannot find a token when there are none") {
            expect(identity.findOpenIDToken(claim: "iss", value: "https://something")).to(beNil())
        }

        it("can find a token") {
            identity.openIDTokens = [token]
            expect(identity.findOpenIDToken(claim: "iss", value: issuer)) == token
        }

        it("has no encryption key pairs initially") {
            expect(identity.encryptionKeyPairs.count) == 0
        }
    }
}

private let token = "eyJhbGciOiJSUzI1NiIsInR5c" +
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
private let issuer = "http://ec2-35-158-20-161.eu-central-1.compute.amazonaws.com:8080/auth/realms/master"

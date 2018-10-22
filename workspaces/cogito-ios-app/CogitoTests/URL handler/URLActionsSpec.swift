import Quick
import Nimble
@testable import Cogito

class URLActionsSpec: QuickSpec {
    override func spec() {
        var store: RecordingStore!

        beforeEach {
            store = RecordingStore()
            store.state = appState(diamond: DiamondState(facets: [Identity.example]))
        }

        context("when a telepath connect url is received") {
            beforeEach {
                let url = URL(string: "https://cogito.example.com/telepath/connect#I=1234&E=abcd&A=QQ")!
                store.dispatch(URLActions.HandleIncomingURL(url: url))
            }

            it("dispatches the telepath connect action") {
                expect(store.firstAction(ofType: TelepathActions.ConnectFulfilled.self)).toNot(beNil())
            }
        }

        context("when an attestation url is received") {
            beforeEach {
                let url = URL(string: "https://cogito.example.com/attestations/receive#A=k%3Av")!
                store.dispatch(URLActions.HandleIncomingURL(url: url))
            }

            it("stores the attestation") {
                expect(store.firstAction(ofType: DiamondActions.StoreAttestation.self)).toNot(beNil())
            }
        }
    }
}

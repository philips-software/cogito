import Quick
import Nimble
import Foundation
import ReSwiftThunk
@testable import Cogito

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

        it("dispatches Open Id AttestationActions action") {
            let linkString = "https://cogito.mobi/applinks/openid-callback#id_token=whatever&not-before-policy=0"
            // swiftlint:disable:next force_cast
            let startAction = LaunchActions.create(forLink: URL(string: linkString)!)! as! ThunkAction<AppState>
            let dispatchRecorder = DispatchRecorder<OpenIDAttestationActions.FinishRejected>()
            startAction.action(dispatchRecorder.dispatch, { return nil })
            expect(dispatchRecorder.count) == 1
        }

        context("when there is at least one identity in the app") {
            var store: RecordingStore!
            var identity: Identity!
            beforeEach {
                identity = Identity.example
                store = RecordingStore()
                store.state = appState(diamond: DiamondState(facets: [identity]))
            }

            it("can process email attestation") {
                let linkString = "https://cogito.mobi/attestations/receive#A=email:user@example.com"
                // swiftlint:disable:next force_cast
                let startAction = LaunchActions.create(forLink: URL(string: linkString)!)! as! ThunkAction<AppState>
                store.dispatch(startAction)

                let action = store.lastAction(ofType: DiamondActions.StoreAttestation.self)
                expect(action?.attestation) == Attestation(string: "email:user@example.com")
            }

            it("can process telepath requests") {
                let linkString = "https://cogito.mobi/telepath/connect#" +
                    "I=imj6m8JJrjbpkHUof00dW86R&" +
                    "E=RsJzOXIOp5wufr406_bgMFX0krFC17T8j19RK2Eeawg&" +
                    "A=RXhhbXBsZUFwcA"
                // swiftlint:disable:next force_cast
                let startAction = LaunchActions.create(forLink: URL(string: linkString)!)! as! ThunkAction<AppState>
                store.dispatch(startAction)

                let action = store.lastAction(ofType: TelepathActions.ConnectFulfilled.self)
                expect(action?.channel.connectUrl) == URL(string: linkString)
            }

            it("does nothing when the attestation link is corrupted") {
                let linkString = "https://cogito.mobi/attestations/receive#A=email"
                // swiftlint:disable:next force_cast
                let startAction = LaunchActions.create(forLink: URL(string: linkString)!)! as! ThunkAction<AppState>
                store.dispatch(startAction)

                expect(store.actions.count) == 0
            }

            it("does nothing when telepath link is complete but corrupted") {
                let linkString = "https://cogito.mobi/telepath/connect#" +
                    "I=abcd&" +
                    "E=1234&" +
                    "A=aaa"
                // swiftlint:disable:next force_cast
                let startAction = LaunchActions.create(forLink: URL(string: linkString)!)! as! ThunkAction<AppState>
                store.dispatch(startAction)

                expect(store.actions.count) == 1
                let action = store.firstAction(ofType: TelepathActions.ConnectRejected.self)
                expect(action?.identity) == identity
            }

            it("does nothing when telepath link is incomplete") {
                let linkString = "https://cogito.mobi/telepath/connect#" +
                    "I=imj6m8JJrjbpkHUof00dW86R&"
                let startAction = LaunchActions.create(forLink: URL(string: linkString)!) as? ThunkAction<AppState>
                expect(startAction).to(beNil())
            }
        }

        context("when there are no identities in the app") {
            var store: RecordingStore!
            beforeEach {
                store = RecordingStore()
            }

            it("does nothing when receiving attestation link") {
                let linkString = "https://cogito.mobi/attestations/receive#A=email:user@example.com"
                // swiftlint:disable:next force_cast
                let startAction = LaunchActions.create(forLink: URL(string: linkString)!)! as! ThunkAction<AppState>
                store.dispatch(startAction)

                expect(store.actions.count) == 0
            }

            it("does nothing when receiving telepath link") {
                let linkString = "https://cogito.mobi/telepath/connect#" +
                    "I=imj6m8JJrjbpkHUof00dW86R&" +
                    "E=RsJzOXIOp5wufr406_bgMFX0krFC17T8j19RK2Eeawg&" +
                "A=RXhhbXBsZUFwcA"
                // swiftlint:disable:next force_cast
                let startAction = LaunchActions.create(forLink: URL(string: linkString)!)! as! ThunkAction<AppState>
                store.dispatch(startAction)

                expect(store.actions.count) == 0
            }
        }
    }
}

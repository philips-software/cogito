import Quick
import Nimble
import Geth
@testable import Cogito

class DiamondReducerSpec: QuickSpec {
    override func spec() {
        var keyStoreDir: String!
        var keyStore: GethKeyStore!
        var account0: GethAccount!

        beforeEach {
            keyStoreDir = NSSearchPathForDirectoriesInDomains(.cachesDirectory,
                                                              .userDomainMask,
                                                              true)[0] + "/test.keystore"
            keyStore = GethKeyStore(keyStoreDir,
                                    scryptN: GethLightScryptN,
                                    scryptP: GethLightScryptP)
            expect {
                account0 = try keyStore.newAccount("some pass")
            }.toNot(throwError())
        }

        afterEach {
            do {
                try FileManager.default.removeItem(atPath: keyStoreDir)
            } catch let error {
                print(error)
                abort()
            }
        }

        it("handles CreateFacet") {
            let action = DiamondActions.CreateFacet(description: "my id", account: account0)
            let newState = diamondReducer(action: action, state: nil)
            expect(newState.facets.count) == 1
            let firstFacet = newState.facets.values.first!
            expect(firstFacet.description) == "my id"
            expect(firstFacet.address) == Address(from: account0.getAddress()!)
            expect(newState.selectedFacetId) == firstFacet.identifier
        }

        it("doesn't change selectedFacet when one was already selected") {
            var state = DiamondState(facets: [])
            let someIdentifier = UUID()
            state.selectedFacetId = someIdentifier
            let action = DiamondActions.CreateFacet(description: "my id", account: account0)
            let newState = diamondReducer(action: action, state: state)
            expect(newState.selectedFacetId) == someIdentifier
        }

        it("stores OpenID attestations") {
            let identity = Identity.example
            let idToken = "some token"
            let initialState = DiamondState(facets: [identity])
            let action = DiamondActions.StoreOpenIDAttestation(identity: identity, idToken: idToken)
            let nextState = diamondReducer(action: action, state: initialState)
            let expectedAttestation = Attestation(oidcToken: idToken)
            expect(nextState.facets[identity.identifier]!.attestations).to(contain(expectedAttestation))
        }

        it("stores attestations") {
            let attestation = Attestation(type: "x", value: "some attestation")
            let identity = Identity.example
            let state = DiamondState(facets: [identity])
            let action = DiamondActions.StoreAttestation(identity: identity, attestation: attestation)
            let nextState = diamondReducer(action: action, state: state)
            expect(nextState.selectedFacet()?.attestations).to(contain(attestation))
        }

        it("stores a newly created encryption keypair") {
            let identity = Identity.example
            let tag = "some tag"
            let initialState = DiamondState(facets: [identity])
            let action = DiamondActions.StoreEncryptionKeyPair(identity: identity, tag: tag)
            let nextState = diamondReducer(action: action, state: initialState)
            expect(nextState.facets[identity.identifier]!.encryptionKeyPairs).to(contain(tag))
        }

        it("handles DeleteFacet") {
            let identity = Identity.example
            let initialState = DiamondState(facets: [identity])
            let action = DiamondActions.DeleteFacet(uuid: identity.identifier)
            let nextState = diamondReducer(action: action, state: initialState)
            expect(nextState.facets.count) == 0
        }

        it("changes selectedFacet if DeleteFacet deletes the selected one") {
            let identity = Identity.example
            var initialState = DiamondState(facets: [identity])
            initialState.selectedFacetId = identity.identifier
            let action = DiamondActions.DeleteFacet(uuid: identity.identifier)
            let nextState = diamondReducer(action: action, state: initialState)
            expect(nextState.selectedFacetId).to(beNil())
        }

        it("handles SelectFacet") {
            let identity = Identity.example
            var initialState = DiamondState(facets: [identity])
            initialState.selectedFacetId = nil
            let action = DiamondActions.SelectFacet(uuid: identity.identifier)
            let nextState = diamondReducer(action: action, state: initialState)
            expect(nextState.selectedFacetId) == identity.identifier
        }

        it("doesn't allow selecting non-existing identity") {
            var initialState = DiamondState(facets: [])
            initialState.selectedFacetId = nil
            let action = DiamondActions.SelectFacet(uuid: UUID())
            let nextState = diamondReducer(action: action, state: initialState)
            expect(nextState.selectedFacetId).to(beNil())
        }
    }
}

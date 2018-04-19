//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
@testable import Cogito

class IdentityManagerViewControllerSpec: QuickSpec {
    override func spec() {
        var identityManagerController: IdentityManagerViewController!

        beforeEach {
            let bundle = Bundle(for: IdentityManagerViewController.self)
            let storyboard = UIStoryboard(name: "IdentityManager", bundle: bundle)
            let viewController = storyboard.instantiateViewController(withIdentifier: "IdentityManager")
            identityManagerController = viewController as? IdentityManagerViewController
            expect(viewController.view).toNot(beNil())
        }

        it("resets create identity when showing the create identity form") {
            var reset = false
            identityManagerController.actions = IdentityManagerViewController.Actions(
                resetCreateIdentity: { reset = true },
                deleteIdentity: { _ in },
                selectIdentity: { _ in }
            )
            let createIdentityController = CreateIdentityViewController()
            let segue = UIStoryboardSegue(identifier: "CreateIdentity",
                                          source: identityManagerController,
                                          destination: createIdentityController)
            identityManagerController.prepare(for: segue, sender: nil)
            createIdentityController.onDone()
            expect(reset).toEventually(beTrue())
        }

        context("given some identities") {
            let testAddress = Address.testAddress
            let testAddress1 = Address.testAddress1
            let testIdentity = Identity(description: "testdesc", address: testAddress)
            let testIdentity1 = Identity(description: "testdesc1", address: testAddress1)
            var model: [IdentityManagerViewController.ViewModel.FacetGroup]!

            beforeEach {
                model = [IdentityManagerViewController.ViewModel.FacetGroup(items: [
                    IdentityManagerViewController.ViewModel.Facet(facet: testIdentity),
                    IdentityManagerViewController.ViewModel.Facet(facet: testIdentity1)
                ])]
                identityManagerController.props = IdentityManagerViewController.Props(
                    facetGroups: model,
                    selectedFacetIndex: 0
                )
            }

            it("triggers delete identity action") {
                var deletedUuid: UUID? = nil
                identityManagerController.actions = IdentityManagerViewController.Actions(
                    resetCreateIdentity: {},
                    deleteIdentity: { uuid in deletedUuid = uuid },
                    selectIdentity: { _ in }
                )
                identityManagerController.itemDeleted(at: IndexPath(row: 0, section: 0))
                expect(deletedUuid) == testIdentity.identifier
            }

            it("triggers select identity action") {
                var selectedUuid: UUID? = nil
                identityManagerController.actions = IdentityManagerViewController.Actions(
                    resetCreateIdentity: {},
                    deleteIdentity: { _ in },
                    selectIdentity: { uuid in selectedUuid = uuid })
                let indexPath = IndexPath(row: 1, section: 0)
                identityManagerController.itemSelected(at: indexPath)
                expect(selectedUuid) == testIdentity1.identifier
            }
        }

        describe("Map state to props") {
            it("maps selectedFacetIndex") {
                let identity0 = Identity(description: "id0", address: Address.testAddress)
                let identity1 = Identity(description: "id1", address: Address.testAddress1)
                var diamond = DiamondState(facets: [identity0, identity1])
                diamond.selectedFacetId = identity1.identifier
                let state = appState(diamond: diamond)
                identityManagerController.connection.newState(state: state)
                expect(identityManagerController.props.selectedFacetIndex) == 1
            }
        }

        describe("Map dispatch to actions") {
            var store: RecordingStore!

            beforeEach {
                store = RecordingStore()
                identityManagerController.connection.store = store
            }

            it("maps resetCreateIdentity") {
                identityManagerController.actions.resetCreateIdentity()
                expect(store.firstAction(ofType: CreateIdentityActions.ResetForm.self)).toNot(beNil())
            }

            it("maps deleteIdentity") {
                let uuid = UUID()
                identityManagerController.actions.deleteIdentity(uuid)
                expect(store.firstAction(ofType: DiamondActions.DeleteFacet.self)?.uuid) == uuid
            }

            it("maps selectIdentity") {
                let uuid = UUID()
                identityManagerController.actions.selectIdentity(uuid)
                expect(store.firstAction(ofType: DiamondActions.SelectFacet.self)?.uuid) == uuid
            }
        }
    }
}

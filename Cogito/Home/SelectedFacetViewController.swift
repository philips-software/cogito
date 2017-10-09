//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import ReSwift
import ReRxSwift
import RxSwift

class SelectedFacetViewController: UIViewController, Connectable {

    let connection = Connection(store: appStore,
                                mapStateToProps: mapStateToProps,
                                mapDispatchToActions: mapDispatchToActions)
    @IBOutlet weak var headerButton: UIButton!

    override func viewDidLoad() {
        super.viewDidLoad()
        connection.bind(\Props.selectedFacet, to: headerButton.rx.title(for: .normal)) {
            ($0 != nil) ? "I am." : "Who am I?"
        }
        connection.bind(\Props.selectedFacet, to: headerButton.rx.isUserInteractionEnabled) {
            $0 == nil
        }
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        connection.connect()
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        connection.disconnect()
    }

    @IBAction func whoAmITouched() {
        actions.resetCreateIdentity()
        let storyboard = UIStoryboard(name: "InitialSetup", bundle: Bundle(for: type(of: self)))
        let setupVC = storyboard.instantiateInitialViewController()
        present(setupVC!, animated: true)
    }

    struct Props {
        let selectedFacet: Identity?
    }

    struct Actions {
        let resetCreateIdentity: () -> Void
    }
}

private func mapStateToProps(state: AppState) -> SelectedFacetViewController.Props {
    let selectedFacet: Identity?
    if state.diamond.selectedFacet >= 0 {
        selectedFacet = state.diamond.facets[state.diamond.selectedFacet]
    } else {
        selectedFacet = nil
    }
    return SelectedFacetViewController.Props(selectedFacet: selectedFacet)
}

private func mapDispatchToActions(dispatch: @escaping DispatchFunction)
    -> SelectedFacetViewController.Actions {
    return SelectedFacetViewController.Actions(
        resetCreateIdentity: { dispatch(CreateIdentityActions.Reset()) }
    )
}

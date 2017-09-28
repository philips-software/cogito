//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import UIKit
import ReSwift

class CreateIdentityViewController: UIViewController {

    @IBOutlet weak var descriptionField: UITextField!
    @IBOutlet weak var createButton: UIButton!

    @IBAction func editingEnded() {
    }

    @IBAction func createTapped() {
    }

    struct Props {
        let description: String
    }
    struct Actions {
        let setDescription: (String) -> Void
        let createIdentity: () -> Void
    }
}

private func mapStateToProps(state: AppState) -> CreateIdentityViewController.Props {
    return CreateIdentityViewController.Props(description: state.createIdentity.description)
}

private func mapDispatchToActions(dispatch: @escaping DispatchFunction) -> CreateIdentityViewController.Actions {
    return CreateIdentityViewController.Actions(
        setDescription: { desc in dispatch(CreateIdentityActions.SetDescription(description: desc)) },
        createIdentity: { dispatch(CreateIdentityActions.CreateIdentity()) }
    )
}

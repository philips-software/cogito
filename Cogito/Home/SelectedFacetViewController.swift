//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import ReSwift
import ReRxSwift
import RxSwift
import Geth

class SelectedFacetViewController: UIViewController, Connectable {

    let connection = Connection(store: appStore,
                                mapStateToProps: mapStateToProps,
                                mapDispatchToActions: mapDispatchToActions)
    @IBOutlet weak var headerButton: UIButton!
    @IBOutlet weak var facetLabel: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()
        headerButton.titleLabel?.textAlignment = .center
        connection.bind(\Props.selectedFacet, to: headerButton.rx.title(for: .normal)) { [unowned self] in
            ($0 != nil && !self.firstFacetWasCreated()) ? "I am." : "Who am I?"
        }
        connection.bind(\Props.selectedFacet, to: facetLabel.rx.isHidden) { [unowned self] in
            !($0 != nil && !self.firstFacetWasCreated())
        }
        connection.bind(\Props.selectedFacet, to: headerButton.rx.isUserInteractionEnabled) {
            $0 == nil
        }
        connection.bind(\Props.selectedFacet, to: facetLabel.rx.text) { $0?.description ?? "" }
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        connection.connect()
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        if firstFacetWasCreated() {
            transitionToSelectedFacet()
        }
    }

    func firstFacetWasCreated() -> Bool {
        return props.createdNewAccount != nil && props.selectedFacet != nil && props.facets.count == 1
    }

    private func transitionToSelectedFacet() {
        connection.disconnect()

        let text = "Who am I?"
        var endIndex = text.endIndex
        var delay: Double = 0
        let delayStep = 0.2
        repeat {
            endIndex = text.index(endIndex, offsetBy: -1)
            delay += delayStep
            setHeaderTitle(String(text[..<endIndex]), afterDelay: delay)
        } while endIndex > text.startIndex

        let newText = "I am."
        endIndex = newText.startIndex
        repeat {
            endIndex = newText.index(endIndex, offsetBy: 1)
            delay += delayStep
            setHeaderTitle(String(newText[..<endIndex]), afterDelay: delay)
        } while endIndex < newText.endIndex

        delay += delayStep
        facetLabel.alpha = 0
        facetLabel.isHidden = false
        UIView.animate(withDuration: 2, delay: delay,
                       usingSpringWithDamping: 1, initialSpringVelocity: 0,
                       options: [],
                       animations: { [weak self] in
            self?.facetLabel.alpha = 1
        })

        delay += delayStep
        DispatchQueue.main.asyncAfter(deadline: .now() + delay) { [weak self] in
            self?.connection.connect()
            self?.actions.resetCreateIdentity()
        }
    }

    private func setHeaderTitle(_ title: String, afterDelay delay: Double) {
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + delay) { [weak self] in
            self?.headerButton.titleLabel?.text = title
        }
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
        let createdNewAccount: GethAccount?
        let facets: [Identity]
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
    return SelectedFacetViewController.Props(
        selectedFacet: selectedFacet,
        createdNewAccount: state.createIdentity.newAccount,
        facets: state.diamond.facets
    )
}

private func mapDispatchToActions(dispatch: @escaping DispatchFunction)
    -> SelectedFacetViewController.Actions {
    return SelectedFacetViewController.Actions(
        resetCreateIdentity: { dispatch(CreateIdentityActions.Reset()) }
    )
}

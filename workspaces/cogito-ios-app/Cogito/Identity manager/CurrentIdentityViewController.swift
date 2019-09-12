import UIKit
import ReSwift
import RxSwift
import ReRxSwift

class CurrentIdentityViewController: UIViewController, Connectable {
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var cameraButton: UIButton!
    @IBOutlet weak var previewContainer: UIView!
    @IBOutlet weak var leftShutter: UIView!
    @IBOutlet weak var rightShutter: UIView!

    override func viewDidLoad() {
        super.viewDidLoad()

        connection.bind(\Props.selectedFacet, to: nameLabel.rx.attributedText) {
            $0?.formatted()
        }
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        connection.connect()
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        if presentedViewController == nil {
            connection.disconnect()
        }
    }

    let connection = Connection(store: appStore,
                                mapStateToProps: mapStateToProps,
                                mapDispatchToActions: mapDispatchToActions)
    struct Props {
        let selectedFacet: Identity?
    }

    struct Actions {}
}

private func mapStateToProps(state: AppState) -> CurrentIdentityViewController.Props {
    return CurrentIdentityViewController.Props(
        selectedFacet: state.diamond.selectedFacet()
    )
}

private func mapDispatchToActions(dispatch: @escaping DispatchFunction)
    -> CurrentIdentityViewController.Actions {
        return CurrentIdentityViewController.Actions()
}

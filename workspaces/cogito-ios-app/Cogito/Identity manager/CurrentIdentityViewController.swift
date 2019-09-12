import UIKit
import ReSwift
import RxSwift
import ReRxSwift
import RichString

private let typewriter = UIFont(name: "American Typewriter", size: 17)!
private let boldTypewriter: UIFont = {
    let bold = typewriter.fontDescriptor.withSymbolicTraits(UIFontDescriptor.SymbolicTraits.traitBold)!
    return UIFont(descriptor: bold, size: 17)
}()

class CurrentIdentityViewController: UIViewController, Connectable {
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var cameraButton: UIButton!
    @IBOutlet weak var previewContainer: UIView!
    @IBOutlet weak var leftShutter: UIView!
    @IBOutlet weak var rightShutter: UIView!

    override func viewDidLoad() {
        super.viewDidLoad()

        connection.bind(\Props.selectedFacet, to: nameLabel.rx.attributedText) {
            "I am ".font(boldTypewriter) +
            ($0?.formatted() ?? NSAttributedString())
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

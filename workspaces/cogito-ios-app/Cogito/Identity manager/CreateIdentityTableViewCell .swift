import UIKit

class CreateIdentityTableViewCell: UITableViewCell {
    @IBOutlet weak var nameEntryField: NameEntryField!
    @IBOutlet weak var createButton: Button!
    @IBOutlet weak var createButtonTopConstraint: NSLayoutConstraint!
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    @IBOutlet weak var tapToCreateLabel: UILabel!
    @IBOutlet weak var iamLabel: UILabel!
    @IBOutlet weak var creatingLabel: UILabel!

    override func awakeFromNib() {
        createButtonTopConstraint.isActive = false
    }

    func configureTapToCreateLabel(isFirst: Bool) {
        tapToCreateLabel.text =
            isFirst
            ? "Tap to create an identity"
            : "Tap to create another identity"
    }

    func activate() {
        createButtonTopConstraint.isActive = true
        createButton.isHidden = false
        createButton.isEnabled = false
        if #available(iOS 13.0, *) {
            iamLabel.textColor = .label
        } else {
            iamLabel.textColor = .black
        }
        tapToCreateLabel.text = "e.g. \"Aid worker at ...\""
        iamLabel.textColor = .tinted
        activityView.startAnimating()
    }

    func deactivate(isFirst: Bool) {
        createButtonTopConstraint.isActive = false
        createButton.isHidden = true
        tapToCreateLabel.textColor = .tinted
        nameEntryField.resignFirstResponder()
        if #available(iOS 13.0, *) {
            iamLabel.textColor = .label
        } else {
            iamLabel.textColor = .black
        }
        configureTapToCreateLabel(isFirst: isFirst)
    }
}

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

    func activate() {
        createButtonTopConstraint.isActive = true
        createButton.isHidden = false
        createButton.isEnabled = false
        tapToCreateLabel.textColor = .black
        tapToCreateLabel.text = "e.g. your name or \"Traveling\""
        iamLabel.textColor = .tinted
    }

    func deactivate() {
        createButtonTopConstraint.isActive = false
        createButton.isHidden = true
        tapToCreateLabel.textColor = .tinted
        tapToCreateLabel.text = "Tap to create a digital identity"
        nameEntryField.resignFirstResponder()
        iamLabel.textColor = .black
    }
}

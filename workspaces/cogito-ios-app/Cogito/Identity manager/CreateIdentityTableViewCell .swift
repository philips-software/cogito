import UIKit

class CreateIdentityTableViewCell: UITableViewCell {
    @IBOutlet weak var nameEntryField: NameEntryField!
    @IBOutlet weak var createButton: Button!
    @IBOutlet weak var createButtonTopConstraint: NSLayoutConstraint!
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    @IBOutlet weak var tapToCreateLabel: UILabel!

    override func awakeFromNib() {
        createButtonTopConstraint.isActive = false
    }

    func activate() {
        createButtonTopConstraint.isActive = true
        createButton.isHidden = false
        createButton.isEnabled = false
        tapToCreateLabel.isHidden = true
        
    }

    func deactivate() {
        createButtonTopConstraint.isActive = false
        createButton.isHidden = true
        tapToCreateLabel.isHidden = false
        nameEntryField.resignFirstResponder()
    }
}

import UIKit

class CreateIdentityTableViewCell: UITableViewCell {
    @IBOutlet weak var nameEntryField: NameEntryField!
    @IBOutlet weak var createButton: Button!
    @IBOutlet weak var createButtonTopConstraint: NSLayoutConstraint!

    override func awakeFromNib() {
        createButtonTopConstraint.isActive = false
    }
}

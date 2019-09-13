import UIKit

class FacetTableViewCell: UITableViewCell {
    var facet: Identity?
    var enabled: Bool = true {
        didSet {
            facetLabel.textColor = enabled ? .black : .disabled
            iamLabel.textColor = enabled ? .black : .disabled
            tapToEnterLabel.textColor = enabled ? .tinted : .disabled
            selectionStyle = enabled ? .default : .none
        }
    }
    @IBOutlet weak var facetLabel: UILabel!
    @IBOutlet weak var iamLabel: UILabel!
    @IBOutlet weak var tapToEnterLabel: UILabel!
}

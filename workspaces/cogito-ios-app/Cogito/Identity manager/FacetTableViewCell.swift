import UIKit

class FacetTableViewCell: UITableViewCell {
    var enabledFacetText: NSAttributedString?
    var facet: Identity?
    var enabled: Bool = true {
        didSet {
            let enabledColor: UIColor
            if #available(iOS 13.0, *) {
                enabledColor = UIColor.label
            } else {
                enabledColor = UIColor.black
            }
            iamLabel.textColor = enabled ? enabledColor : .disabled
            tapToEnterLabel.textColor = enabled ? .tinted : .disabled
            selectionStyle = enabled ? .default : .none

            if let previousText = enabledFacetText, enabled {
                facetLabel.attributedText = previousText
                enabledFacetText = nil
            } else if !enabled && enabledFacetText == nil {
                enabledFacetText = facetLabel.attributedText
                facetLabel.attributedText = facetLabel.attributedText?.color(.disabled)
            }
        }
    }
    @IBOutlet weak var facetLabel: UILabel!
    @IBOutlet weak var iamLabel: UILabel!
    @IBOutlet weak var tapToEnterLabel: UILabel!
}

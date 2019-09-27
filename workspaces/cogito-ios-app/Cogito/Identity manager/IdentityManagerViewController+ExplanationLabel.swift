import UIKit
import RichString

extension IdentityManagerViewController {
    override func tableView(_ tableView: UITableView, viewForFooterInSection section: Int) -> UIView? {
        if props.numberOfFacets == 0 {
            return explanationView
        } else {
            return nil
        }
    }

    override func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        if props.numberOfFacets == 0 {
            let width = tableView.frame.size.width - 32 // margins of the view
            return explanationLabel.sizeThatFits(CGSize(width: width, height: 1000)).height
                + 40  // just some extra space
        } else {
            return 0
        }
    }

    static let typewriter = UIFont(name: "American Typewriter", size: 15)!
    static var boldTypewriter: UIFont = {
        let bold = typewriter.fontDescriptor.withSymbolicTraits(UIFontDescriptor.SymbolicTraits.traitBold)!
        return UIFont(descriptor: bold, size: 15)
    }()
    static let cogito = "Cogito".font(IdentityManagerViewController.boldTypewriter)
    static let explanationText = NSAttributedString(string: "Why do you need this?\n"
        + "\n"
        + "As an employee of the Red Cross, you need to access many platforms"
        + "  that require different personal information. Red Cross offers ")
        + cogito
        + NSAttributedString(string: " to help you:\n"
            + "\n"
            + "Manage your various digital identities, ensuring your personal"
            + " information stays personal.\n"
            + "\n"
            + "With ")
        + cogito
        + NSAttributedString(string: " you can create your"
            + " digital identities for access as an\n"
            + "\n"
            + "• Aid worker at home\n"
            + "• Aid worker in field\n"
            + "• Aid worker in office")
}

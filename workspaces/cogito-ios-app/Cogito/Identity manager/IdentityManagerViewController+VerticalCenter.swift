import UIKit

// Extension that centers the content vertically when there are no
// identities yet. Please note that `updateTableViewContentInset` needs
// to be called after every reloadData().

extension IdentityManagerViewController {
    override func viewWillLayoutSubviews() {
        updateTableViewContentInset()
    }

    func updateTableViewContentInset() {
        let insets: UIEdgeInsets
        if self.props.numberOfFacets == 0 {
            let viewHeight: CGFloat = view.frame.size.height
            let tableViewContentHeight: CGFloat = tableView.contentSize.height
            let marginHeight: CGFloat = (viewHeight - tableViewContentHeight) / 2.0

            insets = UIEdgeInsets(
                top: marginHeight, left: 0, bottom: -marginHeight, right: 0)
        } else {
            insets = UIEdgeInsets(
                top: 0, left: 0, bottom: 0, right: 0)
        }
        UIView.animate(withDuration: 0.3) {
            self.tableView.contentInset = insets
        }
    }
}

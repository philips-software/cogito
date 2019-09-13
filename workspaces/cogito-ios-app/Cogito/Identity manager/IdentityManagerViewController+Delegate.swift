import UIKit

extension IdentityManagerViewController {
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        let numberOfRows = tableView.numberOfRows(inSection: 0)
        let isLast = indexPath.row == numberOfRows - 1
        return isLast ? 134 : 75
    }

    override func tableView(_ tableView: UITableView, willSelectRowAt indexPath: IndexPath) -> IndexPath? {
        guard !creatingIdentity else { return nil }
        return indexPath
    }

    func itemSelected(at indexPath: IndexPath) {
        guard !creatingIdentity else { return }

        let identity = self.props.facetGroups[indexPath.section].items[indexPath.row]
        guard let uuid = identity.facet?.identifier else {
            findCreateIdentityCell()?.nameEntryField.becomeFirstResponder()
            self.tableView.deselectRow(at: indexPath, animated: true)
            return
        }
        self.actions.selectIdentity(uuid)
    }
}

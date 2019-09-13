import UIKit
import RxDataSources

extension IdentityManagerViewController {
    func configureDataSource() {
        self.tableView.dataSource = nil
        dataSource = RxTableViewSectionedAnimatedDataSource(
            configureCell: configureCell,
            canEditRowAtIndexPath: canEditRow
        )
    }

    func configureCell(
        dataSource: TableViewSectionedDataSource<ViewModel.FacetGroup>,
        tableView: UITableView,
        indexPath: IndexPath,
        item: ViewModel.FacetGroup.Item
        ) -> UITableViewCell {
        let cell: UITableViewCell
        if let facet = item.facet {
            cell = tableView.dequeueReusableCell(withIdentifier: "Facet", for: indexPath)
            if let facetCell = cell as? FacetTableViewCell {
                facetCell.facetLabel?.attributedText = facet.formatted()
                facetCell.facet = item.facet
                facetCell.enabled = !self.creatingIdentity
            }
        } else {
            cell = tableView.dequeueReusableCell(withIdentifier: "CreateIdentity", for: indexPath)
            if let createCell = cell as? CreateIdentityTableViewCell {
                createCell.activityView.isHidden = true
                createCell.creatingLabel.isHidden = true
            }
        }
        return cell
    }

    func canEditRow(
        dataSource: TableViewSectionedDataSource<ViewModel.FacetGroup>,
        indexPath: IndexPath
        ) -> Bool {
        let createCellIndex = props.numberOfFacets
        return indexPath.row < createCellIndex
    }
}

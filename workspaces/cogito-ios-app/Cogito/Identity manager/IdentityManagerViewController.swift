import UIKit
import RxSwift
import RxCocoa
import RxDataSources
import ReSwift
import ReRxSwift
import RichString

class IdentityManagerViewController: UITableViewController, Connectable {

    var creatingIdentity = false
    var resetAppSubscription: NSObjectProtocol?
    var dataSource: RxTableViewSectionedAnimatedDataSource<ViewModel.FacetGroup>!
    let disposeBag = DisposeBag()
    @IBOutlet weak var explanationView: UIView!
    @IBOutlet weak var explanationLabel: UILabel!
    var createIdentityController: CreateIdentityViewController?

    override func viewDidLoad() {
        super.viewDidLoad()
        explanationLabel.attributedText = IdentityManagerViewController.explanationText
        self.navigationController?.isNavigationBarHidden = true
        self.tableView.dataSource = nil
        dataSource = RxTableViewSectionedAnimatedDataSource(
            configureCell: configureCell,
            canEditRowAtIndexPath: canEditRow
        )
        connection.bind(\Props.facetGroups, to: tableView.rx.items(dataSource: dataSource))
        tableView.rx.itemDeleted.subscribe(onNext: { [unowned self] indexPath in
            self.itemDeleted(at: indexPath)
        }).disposed(by: disposeBag)
        tableView.rx.itemSelected.subscribe(onNext: { [unowned self] indexPath in
            self.itemSelected(at: indexPath)
        }).disposed(by: disposeBag)
        connection.subscribe(\Props.selectedFacetIndex) { [unowned self] newIndex in
            self.updateSelectedRow(facetIndex: newIndex)
        }
        connection.subscribe(\Props.numberOfFacets) { [unowned self] newNumber in
            self.findCreateIdentityCell()?.iamLabel.text
                = newNumber > 0 ? "I am also" : "I am"
        }
        subscribeToResetAppNotification()
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

    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        let numberOfRows = tableView.numberOfRows(inSection: 0)
        let isLast = indexPath.row == numberOfRows - 1
        return isLast ? 134 : 75
    }

    func itemDeleted(at indexPath: IndexPath) {
        let identity = self.props.facetGroups[indexPath.section].items[indexPath.row]
        guard let uuid = identity.facet?.identifier else {
            return
        }
        self.actions.deleteIdentity(uuid)
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

    func updateSelectedRow(facetIndex: Int) {
        guard facetIndex < self.tableView.numberOfRows(inSection: 0) else {
            return
        }
        self.tableView.selectRow(at: IndexPath(row: facetIndex, section: 0),
                                 animated: true,
                                 scrollPosition: .middle)
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        connection.connect()
        updateSelectedRow(facetIndex: self.props.selectedFacetIndex)
        self.actions.resetCreateIdentity()
        self.navigationController?.setNavigationBarHidden(true, animated: true)
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        connection.disconnect()
    }

    func subscribeToResetAppNotification() {
        resetAppSubscription =  NotificationCenter.default.addObserver(
            forName: resetAppNotification, object: nil, queue: .main) { _ in
                self.navigationController?.popToRootViewController(animated: false)
                if self.creatingIdentity {
                    self.deactivateCreateNewIdentity()
                    self.createIdentityDone()
                }
            }
    }

    func unsubscribeFromResetAppNotification() {
        if let subscription = resetAppSubscription {
            NotificationCenter.default.removeObserver(subscription)
        }
    }

    @IBAction func done(_ sender: UIBarButtonItem) {
        dismiss(animated: true)
    }

    @IBAction func share(_ sender: UIBarButtonItem) {
        let url = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent("accounts.json")
        let content: [[[String: Any]]] = self.props.facetGroups.map { facetGroup in
            return facetGroup.items.compactMap { item in
                if let facet = item.facet {
                    return [
                        "description": facet.description,
                        "address": facet.address.value,
                        "created": facet.created.description
                    ]
                } else {
                    return nil
                }
            }
        }
        let joinedContent = [[String: Any]](content.joined())
        let data = try? JSONSerialization.data(withJSONObject: joinedContent, options: .prettyPrinted)
        try? data?.write(to: url)

        let activityController = UIActivityViewController(activityItems: [url], applicationActivities: nil)
        present(activityController, animated: true)
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let destination = segue.destination as? CreateIdentityViewController {
            destination.onDone = { [weak self] in
                destination.navigationController?.popViewController(animated: true)
                DispatchQueue.main.async {
                    self?.actions.resetCreateIdentity()
                }
            }
        } else if segue.destination is CurrentIdentityViewController {
            self.navigationController?.setNavigationBarHidden(false, animated: true)
        }
    }

    // MARK: - Props and Actions

    struct Props {
        let facetGroups: [ViewModel.FacetGroup]
        let selectedFacetIndex: Int
        let numberOfFacets: Int
    }
    struct Actions {
        let resetCreateIdentity: () -> Void
        let deleteIdentity: (UUID) -> Void
        let selectIdentity: (UUID) -> Void
    }

    let connection = Connection(store: appStore,
                                mapStateToProps: mapStateToProps,
                                mapDispatchToActions: mapDispatchToActions)
}

private func mapStateToProps(state: AppState) -> IdentityManagerViewController.Props {
    var facets = state.diamond.facets.values
        .map { IdentityManagerViewController.ViewModel.Facet(facet: $0) }
    facets.append(IdentityManagerViewController.ViewModel.Facet.placeHolder)
    let group = IdentityManagerViewController.ViewModel.FacetGroup(items: facets).sorted()

    let selectedIndex: Int
    if let selectedFacet = state.diamond.selectedFacetId {
        selectedIndex = group.items.compactMap { $0.facet?.identifier }.index(of: selectedFacet) ?? 0
    } else {
        selectedIndex = 0
    }

    let groups = [group]
    return IdentityManagerViewController.Props(
        facetGroups: groups,
        selectedFacetIndex: selectedIndex,
        numberOfFacets: state.diamond.facets.count
    )
}

private func mapDispatchToActions(dispatch: @escaping DispatchFunction) -> IdentityManagerViewController.Actions {
    return IdentityManagerViewController.Actions(
        resetCreateIdentity: { dispatch(CreateIdentityActions.ResetForm()) },
        deleteIdentity: { uuid in dispatch(DiamondActions.DeleteFacet(uuid: uuid)) },
        selectIdentity: { uuid in dispatch(DiamondActions.SelectFacet(uuid: uuid)) }
    )
}

typealias CogitoIdentity = Identity

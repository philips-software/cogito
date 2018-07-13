import UIKit
import RxSwift
import RxCocoa
import RxDataSources
import ReSwift
import ReRxSwift
import RichString

class IdentityManagerViewController: UITableViewController, Connectable {

    var dataSource: RxTableViewSectionedAnimatedDataSource<ViewModel.FacetGroup>!
    let disposeBag = DisposeBag()

    override func viewDidLoad() {
        super.viewDidLoad()

        self.tableView.dataSource = nil
        dataSource = RxTableViewSectionedAnimatedDataSource(
            configureCell: { _, tableView, indexPath, item in
                let cell = tableView.dequeueReusableCell(withIdentifier: "Facet", for: indexPath)
                if let facetCell = cell as? FacetTableViewCell {
                    facetCell.textLabel?.attributedText = item.facet.formatted(addSpacePadding: 3)
                    let addr = item.facet.address.description
                    let range = addr.startIndex ..< addr.index(addr.startIndex, offsetBy: 10)
                    facetCell.detailTextLabel?.text = addr[range] + "..."
                    facetCell.accessoryType = .detailDisclosureButton
                    facetCell.facet = item.facet
                }
                return cell
            },
            canEditRowAtIndexPath: { _, _ in return true }
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
    }

    func itemDeleted(at indexPath: IndexPath) {
        let uuid = self.props.facetGroups[indexPath.section].items[indexPath.row].facet.identifier
        self.actions.deleteIdentity(uuid)
    }

    func itemSelected(at indexPath: IndexPath) {
        let uuid = self.props.facetGroups[indexPath.section].items[indexPath.row].facet.identifier
        self.actions.selectIdentity(uuid)
        self.dismiss(animated: true)
    }

    func updateSelectedRow(facetIndex: Int) {
        guard facetIndex < self.tableView.numberOfRows(inSection: 0) else {
            return
        }
        self.tableView.selectRow(at: IndexPath(row: facetIndex, section: 0),
                                 animated: true,
                                 scrollPosition: .middle)
    }

    func showIdentityDetails(for indexPath: IndexPath) {
        let identity = self.props.facetGroups[indexPath.section].items[indexPath.row].facet
        performSegue(withIdentifier: "ShowIdentityDetails", sender: identity)
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        connection.connect()
        updateSelectedRow(facetIndex: self.props.selectedFacetIndex)
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        connection.disconnect()
    }

    @IBAction func done(_ sender: UIBarButtonItem) {
        dismiss(animated: true)
    }

    @IBAction func share(_ sender: UIBarButtonItem) {
        let url = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent("accounts.json")
        let content: [[[String:Any]]] = self.props.facetGroups.map { facetGroup in
            return facetGroup.items.map { item in
                return [
                    "description": item.facet.description,
                    "address": item.facet.address.value,
                    "created": item.facet.created.description
                ]
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
        } else if let destination = segue.destination as? FacetDetailsViewController,
                  let cell = sender as? FacetTableViewCell,
                  let facet = cell.facet {
            destination.facet = facet
        }
    }

    struct Props {
        let facetGroups: [ViewModel.FacetGroup]
        let selectedFacetIndex: Int
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
    let facets = state.diamond.facets.values.map { IdentityManagerViewController.ViewModel.Facet(facet: $0) }
    let group = IdentityManagerViewController.ViewModel.FacetGroup(items: facets).sorted()

    let selectedIndex: Int
    if let selectedFacet = state.diamond.selectedFacetId {
        selectedIndex = group.items.map { $0.facet.identifier }.index(of: selectedFacet) ?? 0
    } else {
        selectedIndex = 0
    }

    let groups = [group]
    return IdentityManagerViewController.Props(
        facetGroups: groups,
        selectedFacetIndex: selectedIndex
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

extension IdentityManagerViewController {
    struct ViewModel {
        // swiftlint:disable nesting

        struct FacetGroup: AnimatableSectionModelType, IdentifiableType, Equatable {
            typealias Identity = String
            typealias Item = Facet

            var identity = "only one"
            var items: [Facet]

            init(items: [Facet]) {
                self.items = items
            }

            init(original: FacetGroup, items: [Facet]) {
                self = original
                self.items = items
            }

            func sorted() -> FacetGroup {
                return FacetGroup(items: items.sorted(by: { (lhs, rhs) -> Bool in
                    return lhs.facet.created < rhs.facet.created
                }))
            }

            static func == (lhs: FacetGroup, rhs: FacetGroup) -> Bool {
                return lhs.items == rhs.items
            }
        }

        struct Facet: IdentifiableType, Equatable {
            typealias Identity = String
            var identity: String { return facet.identifier.uuidString }
            var facet: CogitoIdentity

            static func == (lhs: Facet, rhs: Facet) -> Bool {
                return lhs.facet == rhs.facet
            }
        }
    }
}

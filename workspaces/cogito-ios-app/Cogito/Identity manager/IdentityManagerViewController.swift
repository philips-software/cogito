import UIKit
import RxSwift
import RxCocoa
import RxDataSources
import ReSwift
import ReRxSwift
import RichString

class IdentityManagerViewController: UITableViewController, Connectable {

    var creatingIdentity = false
    var dataSource: RxTableViewSectionedAnimatedDataSource<ViewModel.FacetGroup>!
    let disposeBag = DisposeBag()
    @IBOutlet weak var explanationView: UIView!
    @IBOutlet weak var explanationLabel: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()
        explanationLabel.attributedText = IdentityManagerViewController.explanationText
        self.navigationController?.isNavigationBarHidden = true
        self.tableView.dataSource = nil
        dataSource = RxTableViewSectionedAnimatedDataSource(
            configureCell: { _, tableView, indexPath, item in
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
        connection.subscribe(\Props.numberOfFacets) { [unowned self] newNumber in
            self.findCreateIdentityCell()?.iamLabel.text
                = newNumber > 0 ? "I am also" : "I am"
        }
    }

    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        let numberOfRows = tableView.numberOfRows(inSection: 0)
        let isLast = indexPath.row == numberOfRows - 1
        return isLast ? 134 : 75
    }

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

    // MARK: - Create Identity

    var createIdentityController: CreateIdentityViewController?

    func findCreateIdentityCell() -> CreateIdentityTableViewCell? {
        let numberOfRows = tableView.numberOfRows(inSection: 0)
        let indexPath = IndexPath(row: numberOfRows - 1, section: 0)
        let cell = self.tableView.cellForRow(at: indexPath) as? CreateIdentityTableViewCell
        return cell
    }

    func hookupCreateIdentityController(cell: CreateIdentityTableViewCell) {
        self.actions.resetCreateIdentity()
        createIdentityController = CreateIdentityViewController()
        createIdentityController!.descriptionField = cell.nameEntryField
        createIdentityController!.createButton = cell.createButton
        createIdentityController!.activityView = cell.activityView
        createIdentityController!.activityLabel = cell.creatingLabel
        createIdentityController!.onDone = { [weak self] in
            DispatchQueue.main.async {
                self?.actions.resetCreateIdentity()
                self?.unhookCreateIdentityController()
                self?.tableView.reloadData()
                self?.updateTableViewContentInset()
            }
        }
        createIdentityController!.setup(addingActions: true)
        createIdentityController!.viewWillAppear(false)
    }

    func unhookCreateIdentityController() {
        createIdentityController?.viewDidDisappear(false)
        createIdentityController?.tearDown()
        createIdentityController = nil
    }

    @IBAction func beginEditingNewIdentity(_ sender: Any) {
        activateCreateNewIdentity()
    }

    @IBAction func cancelCreateNewIdentity(_ sender: Any) {
        self.actions.resetCreateIdentity()
        deactivateCreateNewIdentity()
    }

    @IBAction func createNewIdentity(_ sender: Any) {
        deactivateCreateNewIdentity()
    }

    func activateCreateNewIdentity() {
        if let cell = findCreateIdentityCell() {
            creatingIdentity = true
            setExistingFacets(enabled: false)
            cell.activate()
            self.navigationController?.setNavigationBarHidden(false, animated: true)
            hookupCreateIdentityController(cell: cell)
        }
    }

    func deactivateCreateNewIdentity() {
        findCreateIdentityCell()?.deactivate()
        self.navigationController?.setNavigationBarHidden(true, animated: true)
        setExistingFacets(enabled: true)
        creatingIdentity = false
    }

    func setExistingFacets(enabled: Bool) {
        for row in 0..<props.numberOfFacets {
            let indexPath = IndexPath(row: row, section: 0)
            let cell = tableView.cellForRow(at: indexPath)
            if let cell = cell as? FacetTableViewCell {
                cell.enabled = enabled
            }
        }
    }

    // MARK: - Explanation label

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
                + 50  // just some extra space
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
    static let explanationText = NSAttributedString(string: "\n\nWhy do you need this?\n"
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
            + " digital identities for access to\n"
            + "\n"
            + "• RC Health Insurance\n"
            + "• RC Travel\n"
            + "• RC Security")

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
                    guard let lhsFacet = lhs.facet else { return false }
                    guard let rhsFacet = rhs.facet else { return true }
                    return lhsFacet.created < rhsFacet.created
                }))
            }

            static func == (lhs: FacetGroup, rhs: FacetGroup) -> Bool {
                return lhs.items == rhs.items
            }
        }

        struct Facet: IdentifiableType, Equatable {
            static let placeHolder = Facet(facet: nil)

            typealias Identity = String?
            var identity: String? { return facet?.identifier.uuidString }
            var facet: CogitoIdentity?

            static func == (lhs: Facet, rhs: Facet) -> Bool {
                return lhs.facet == rhs.facet
            }
        }
    }
}

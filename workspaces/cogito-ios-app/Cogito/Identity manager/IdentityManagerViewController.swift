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
    @IBOutlet weak var cancelButton: UIBarButtonItem!
    var createIdentityController: CreateIdentityViewController?

    override func viewDidLoad() {
        super.viewDidLoad()
        explanationLabel.attributedText = IdentityManagerViewController.explanationText
        self.navigationController?.navigationBar.setBackgroundImage(UIImage(), for: .default)
        self.navigationController?.navigationBar.isTranslucent = true
        setCancelButton(visible: false, animated: false)

        configureDataSource()
        setupConnection()
        subscribeToResetAppNotification()
    }

    func setCancelButton(visible: Bool, animated: Bool) {
        self.navigationController?.navigationBar.setBackgroundImage(UIImage(), for: .default)
        self.navigationController?.navigationBar.isTranslucent = true
        self.navigationController?.navigationBar.shadowImage = UIImage()
        self.navigationItem.rightBarButtonItem = visible ? cancelButton : nil
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        connection.connect()
        self.actions.resetCreateIdentity()
        setCancelButton(visible: false, animated: true)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        setCancelButton(visible: false, animated: animated)
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        connection.disconnect()
    }

    func updateSelectedRow(facetIndex: Int) {
        guard facetIndex < self.tableView.numberOfRows(inSection: 0) else {
            return
        }
        self.tableView.selectRow(at: IndexPath(row: facetIndex, section: 0),
                                 animated: true,
                                 scrollPosition: .middle)
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
            self.setCancelButton(visible: true, animated: true)
        }
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

    // MARK: - Connection

    struct Props {
        let facetGroups: [ViewModel.FacetGroup]
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

    func setupConnection() {
        connection.bind(\Props.facetGroups, to: tableView.rx.items(dataSource: dataSource))
        tableView.rx.itemSelected.subscribe(onNext: { [unowned self] indexPath in
            self.itemSelected(at: indexPath)
        }).disposed(by: disposeBag)
        connection.subscribe(\Props.numberOfFacets) { [unowned self] newNumber in
            self.findCreateIdentityCell()?.iamLabel.text
                = newNumber > 0 ? "I am also" : "I am"
        }
    }
}

private func mapStateToProps(state: AppState) -> IdentityManagerViewController.Props {
    var facets = state.diamond.facets.values
        .map { IdentityManagerViewController.ViewModel.Facet(facet: $0) }
    facets.append(IdentityManagerViewController.ViewModel.Facet.placeHolder)
    let group = IdentityManagerViewController.ViewModel.FacetGroup(items: facets).sorted()

    let groups = [group]
    return IdentityManagerViewController.Props(
        facetGroups: groups,
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

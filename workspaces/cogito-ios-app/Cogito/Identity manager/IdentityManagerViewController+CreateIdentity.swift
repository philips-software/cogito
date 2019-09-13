import UIKit

extension IdentityManagerViewController {
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
                self?.createIdentityDone()
            }
        }
        createIdentityController!.setup(addingActions: true)
        createIdentityController!.viewWillAppear(false)
    }

    func createIdentityDone() {
        self.actions.resetCreateIdentity()
        self.unhookCreateIdentityController()
        self.tableView.reloadData()
        self.updateTableViewContentInset()
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
            self.setCancelButton(visible: true, animated: true)
            hookupCreateIdentityController(cell: cell)
        }
    }

    func deactivateCreateNewIdentity() {
        findCreateIdentityCell()?.deactivate()
        self.setCancelButton(visible: false, animated: true)
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
}

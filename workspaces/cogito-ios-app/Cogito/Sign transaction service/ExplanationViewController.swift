import UIKit

class ExplanationViewController: UIViewController {

    @IBOutlet weak var applicationLabel: UILabel!
    @IBOutlet weak var actionLabel: UILabel!
    @IBOutlet weak var identityLabel: UILabel!
    @IBOutlet weak var signButton: UIButton!
    @IBOutlet weak var rejectButton: UIButton!
    @IBOutlet weak var activityView: UIStackView!

    var appName: String = ""
    var actionDescription: String = ""
    var identity: Identity?
    var onSign: () -> Void = {}
    var onReject: () -> Void = {}

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        configureUI()
    }

    func configureUI() {
        applicationLabel.text = appName
        actionLabel.text = actionDescription
        if let identityDescription = identity?.formatted() {
            identityLabel.attributedText = identityDescription
        }
    }

    @IBAction func cancel(_ sender: Any) {
        dismiss(animated: true, completion: {})
    }

    @IBAction func sign() {
        signButton.isHidden = true
        rejectButton.isHidden = true
        activityView.isHidden = false
        onSign()
    }

    @IBAction func reject() {
        onReject()
    }
}

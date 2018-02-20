//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit

class ExplanationViewController: UIViewController {

    @IBOutlet weak var explanationLabel: UILabel!
    @IBOutlet weak var signButton: UIButton!
    @IBOutlet weak var rejectButton: UIButton!

    var appName: String = ""
    var actionDescription: String = ""
    var onSign: () -> Void = {}
    var onReject: () -> Void = {}

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        configureExplanation()
    }

    func configureExplanation() {
        let text = "\(appName) requests your signature to \(actionDescription)."
        explanationLabel.text = text
    }

    @IBAction func cancel(_ sender: Any) {
        dismiss(animated: true, completion: {})
    }

    @IBAction func sign() {
        onSign()
    }

    @IBAction func reject() {
        onReject()
    }
}

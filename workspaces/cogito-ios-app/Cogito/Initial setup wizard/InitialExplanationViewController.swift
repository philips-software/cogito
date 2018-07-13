import UIKit

class InitialExplanationViewController: UIViewController {

    @IBAction func cancel(_ sender: UIBarButtonItem) {
        dismiss(animated: true)
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let nextVC = segue.destination as? CreateIdentityViewController {
            nextVC.onDone = { nextVC.dismiss(animated: true) }
        }
    }
}

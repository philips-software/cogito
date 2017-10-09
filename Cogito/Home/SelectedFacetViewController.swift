//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit

class SelectedIdentityViewController: UIViewController {

    @IBAction func whoAmITouched() {
        let storyboard = UIStoryboard(name: "InitialSetup", bundle: Bundle(for: type(of: self)))
        let setupVC = storyboard.instantiateInitialViewController()
        present(setupVC!, animated: true)
    }

}

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import RxSwift
import RxCocoa
import RxDataSources

class IdentityManagerViewController: UITableViewController {

    @IBAction func done(_ sender: UIBarButtonItem) {
        dismiss(animated: true)
    }

}

extension IdentityManagerViewController {
    private struct FacetGroup {
    }
}

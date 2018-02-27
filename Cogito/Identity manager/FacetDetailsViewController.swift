//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit

class FacetDetailsViewController: UITableViewController {
    var facet: Identity? {
        didSet {
            self.title = facet?.description
        }
    }
}

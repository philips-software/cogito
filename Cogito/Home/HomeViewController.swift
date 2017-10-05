//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit

class HomeViewController: UIViewController {
    @IBOutlet weak var cameraButton: UIButton!

    override func viewDidLoad() {
        super.viewDidLoad()
        cameraButton.layer.borderColor = UIColor.darkGray.cgColor
        cameraButton.layer.borderWidth = 2
        cameraButton.layer.cornerRadius = cameraButton.bounds.size.width / 2
    }
}

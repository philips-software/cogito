//  Copyright © 2018 Koninklijke Philips Nederland B.V. All rights reserved.

import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    @IBAction func receive(_ sender: Any) {
        TelepathHandler.shared.receive()
    }

    @IBAction func notify(_ sender: Any) {
        TelepathHandler.shared.notify()
    }
    
}


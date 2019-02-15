//  Copyright © 2018 Koninklijke Philips Nederland B.V. All rights reserved.

import UIKit

class ViewController: UIViewController {
    @IBAction func receive(_ sender: Any) {
        TelepathHandler.shared.receive()
    }

    @IBAction func notify(_ sender: Any) {
        TelepathHandler.shared.sendDidConnectNotification()
    }
}

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import AVFoundation
import QRCodeReader

class HomeViewController: UIViewController, QRCodeReaderViewControllerDelegate {
    @IBOutlet weak var cameraButton: UIButton!
    @IBOutlet weak var previewContainer: UIView!
    @IBOutlet weak var leftShutter: UIView!
    @IBOutlet weak var rightShutter: UIView!

    lazy var readerVC: QRCodeReaderViewController = {
        let builder = QRCodeReaderViewControllerBuilder {
            $0.reader = QRCodeReader(metadataObjectTypes: [.qr], captureDevicePosition: .back)
            $0.showCancelButton = false
            $0.showOverlayView = false
            $0.showSwitchCameraButton = false
            $0.startScanningAtLoad = false
        }

        let readerVC = QRCodeReaderViewController(builder: builder)
        addChildViewController(readerVC)
        previewContainer.insertSubview(readerVC.view, at: 0)
        readerVC.view.frame = CGRect(x: 0, y: 0,
                                     width: previewContainer.frame.size.width,
                                     height: previewContainer.frame.size.height)
        return readerVC
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        cameraButton.layer.borderColor = UIColor.darkGray.cgColor
        cameraButton.layer.borderWidth = 2
        cameraButton.layer.cornerRadius = cameraButton.bounds.size.width / 2
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        readerVC.delegate = self
    }

    @IBAction func openScanner() {
        startScanning()
    }

    @IBAction func closeScanner() {
        stopScanning()
    }

    private func startScanning() {
        readerVC.startScanning()
        UIView.animate(withDuration: 0.3,
                       delay: 0,
                       usingSpringWithDamping: 1,
                       initialSpringVelocity: 0,
                       options: .beginFromCurrentState,
                       animations: {
            self.leftShutter.frame.origin.x = -self.leftShutter.frame.size.width
            self.rightShutter.frame.origin.x = self.rightShutter.superview!.frame.size.width
        })
    }

    private func stopScanning() {
        readerVC.stopScanning()
        UIView.animate(withDuration: 0.3,
                       delay: 0,
                       usingSpringWithDamping: 1,
                       initialSpringVelocity: 0,
                       options: .beginFromCurrentState,
                       animations: {
            self.leftShutter.frame.origin.x = 0
            self.rightShutter.frame.origin.x = self.rightShutter.superview!.frame.size.width / 2
        })
    }

    func reader(_ reader: QRCodeReaderViewController, didScanResult result: QRCodeReaderResult) {
        stopScanning()
    }

    func readerDidCancel(_ reader: QRCodeReaderViewController) {
        stopScanning()
    }
}

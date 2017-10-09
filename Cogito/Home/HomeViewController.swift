//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import AVFoundation
import QRCodeReader

class HomeViewController: UIViewController, QRCodeReaderViewControllerDelegate {
    @IBOutlet weak var cameraButton: UIButton!
    @IBOutlet weak var previewContainer: UIView!
    @IBOutlet weak var leftShutter: UIView!
    @IBOutlet weak var rightShutter: UIView!
    @IBOutlet weak var lineAnimation: UIView!
    @IBOutlet weak var animationHeight: NSLayoutConstraint!
    @IBOutlet weak var animationBottom: NSLayoutConstraint!
    @IBOutlet weak var selectedFacetView: UIView!
    @IBOutlet weak var ellipseAnimation: UIView!
    let rectShape = CAShapeLayer()

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

        rectShape.fillColor = UIColor.clear.cgColor
        rectShape.strokeColor = UIColor.black.cgColor
        ellipseAnimation.layer.addSublayer(rectShape)
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        readerVC.delegate = self
    }

    @IBAction func scanButtonDown() {
//        startScanning()
    }

    @IBAction func scanButtonUpInside() {
        stopScanning()

        rectShape.frame = ellipseAnimation.bounds
        let distance = cameraButton.frame.midY - selectedFacetView.frame.midY - 10 // trial and error
        let startShape = UIBezierPath(ovalIn: CGRect(x: rectShape.frame.midX,
                                                     y: rectShape.frame.midY - 28,
                                                     width: 0, height: 0))
        let endShape = UIBezierPath(ovalIn: CGRect(x: 0,
                                                   y: 0 - 28,
                                                   width: rectShape.frame.size.width,
                                                   height: rectShape.frame.size.height))
        rectShape.path = startShape.cgPath

        self.animationHeight.constant = distance
        UIView.animate(withDuration: 1, delay: 0,
                       options: .curveLinear,
                       animations: {
                           self.view.layoutIfNeeded()
                       },
                       completion: { _ in
                           self.animationHeight.constant = 1
                           self.animationBottom.constant = -distance + self.rectShape.frame.size.height/2
                           self.ellipseAnimation.isHidden = false
                           UIView.animate(withDuration: 1, delay: 0,
                                          options: .curveEaseOut,
                                          animations: {
                                              self.view.layoutIfNeeded()
                                              self.lineAnimation.alpha = 0
                                              self.ellipseAnimation.alpha = 0
                                          }, completion: { _ in
                               self.lineAnimation.alpha = 1
                               self.animationBottom.constant = 0
                               self.ellipseAnimation.alpha = 1
                               self.ellipseAnimation.isHidden = true
                           })
                           let animation = CABasicAnimation(keyPath: "path")
                           animation.toValue = endShape.cgPath
                           animation.duration = 1
                           animation.timingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionLinear)
                           animation.fillMode = kCAFillModeBoth
                           animation.isRemovedOnCompletion = false
                           self.rectShape.add(animation, forKey: animation.keyPath)
                       })
    }

    @IBAction func scanButtonUpOutside() {
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

//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import AVFoundation
import QRCodeReader
import ReSwift
import ReRxSwift

class HomeViewController: UIViewController, QRCodeReaderViewControllerDelegate, Connectable {
    let connection = Connection(store: appStore,
                                mapStateToProps: mapStateToProps,
                                mapDispatchToActions: mapDispatchToActions)
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
    var embeddedSelectedFacetController: SelectedFacetViewController!

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
        rectShape.lineWidth = 0.5
        ellipseAnimation.layer.addSublayer(rectShape)
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        connection.connect()
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        readerVC.delegate = self
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        connection.disconnect()
    }

    @IBAction func scanButtonDown() {
        if props.selectedFacet != nil {
            startScanning()
        } else {
            startExplanatoryAnimation()
        }
    }

    @IBAction func scanButtonUpInside() {
        if props.selectedFacet != nil {
            stopScanning()
        } else {
            stopExplanatoryAnimation()
        }
    }

    @IBAction func scanButtonUpOutside() {
        if props.selectedFacet != nil {
            stopScanning()
        } else {
            stopExplanatoryAnimation()
        }
    }

    private func startScanning() {
        readerVC.startScanning()
        UIView.animate(withDuration: 0.1,
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
        UIView.animate(withDuration: 1,
                       delay: 0,
                       usingSpringWithDamping: 1,
                       initialSpringVelocity: 0,
                       options: .beginFromCurrentState,
                       animations: {
                           self.leftShutter.frame.origin.x = 0
                           self.rightShutter.frame.origin.x = self.rightShutter.superview!.frame.size.width / 2
                       })
    }

    let animationDuration = 0.8
    
    private func startExplanatoryAnimation() {
        rectShape.frame = ellipseAnimation.bounds
        let embeddedHeaderViewOffsetFromCenter = selectedFacetView.bounds.midY
            - embeddedSelectedFacetController.headerButton.frame.midY
        let distance = cameraButton.frame.minY - selectedFacetView.frame.midY + embeddedHeaderViewOffsetFromCenter
        let startRect = CGRect(x: rectShape.frame.midX,
                               y: rectShape.frame.midY - embeddedHeaderViewOffsetFromCenter,
                               width: 0, height: 0)
        let endRect = CGRect(x: 0, y: -embeddedHeaderViewOffsetFromCenter,
                             width: rectShape.frame.size.width,
                             height: rectShape.frame.size.height)
        let startShape = UIBezierPath(roundedRect: startRect, cornerRadius: 4)
        let endShape = UIBezierPath(roundedRect: endRect, cornerRadius: 4)
        rectShape.path = startShape.cgPath
        self.animationHeight.constant = distance
        UIView.animate(withDuration: animationDuration,
                       delay: 0,
                       usingSpringWithDamping: 1,
                       initialSpringVelocity: 0,
                       options: .beginFromCurrentState,
                       animations: {
                        self.view.layoutIfNeeded()
        }, completion: { _ in
            let finished = self.animationHeight.constant == distance && self.animationBottom.constant == 0
            if finished {
                self.cameraButton.isUserInteractionEnabled = false
                self.animationHeight.constant = 0
                self.animationBottom.constant = -(self.cameraButton.frame.minY -
                    self.selectedFacetView.frame.maxY + embeddedHeaderViewOffsetFromCenter)
                self.ellipseAnimation.isHidden = false
                UIView.animate(withDuration: self.animationDuration,
                               delay: 0,
                               options: [.beginFromCurrentState, .curveEaseOut],
                               animations: {
                                self.view.layoutIfNeeded()
                                self.lineAnimation.alpha = 0
                                self.ellipseAnimation.alpha = 0
                }, completion: { _ in
                    self.lineAnimation.alpha = 1
                    self.animationBottom.constant = 0
                    self.ellipseAnimation.alpha = 1
                    self.ellipseAnimation.isHidden = true
                    self.cameraButton.isUserInteractionEnabled = true
                })
                let animation = CABasicAnimation(keyPath: "path")
                animation.toValue = endShape.cgPath
                animation.duration = self.animationDuration
                animation.timingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionEaseOut)
                animation.fillMode = kCAFillModeBoth
                animation.isRemovedOnCompletion = false
                self.rectShape.add(animation, forKey: animation.keyPath)
            }
        })
    }

    private func stopExplanatoryAnimation() {
        self.animationHeight.constant = 0
        UIView.animate(withDuration: animationDuration,
                       delay: 0,
                       usingSpringWithDamping: 1,
                       initialSpringVelocity: 0,
                       options: .beginFromCurrentState,
                       animations: {
                        self.view.layoutIfNeeded()
        })
    }

    func reader(_ reader: QRCodeReaderViewController, didScanResult result: QRCodeReaderResult) {
        stopScanning()
    }

    func readerDidCancel(_ reader: QRCodeReaderViewController) {
        stopScanning()
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let selectedFacetViewController = segue.destination as? SelectedFacetViewController {
            embeddedSelectedFacetController = selectedFacetViewController
        }
    }

    struct Props {
        let selectedFacet: Identity?
    }

    struct Actions {
    }
}

private func mapStateToProps(state: AppState) -> HomeViewController.Props {
    let selectedFacet: Identity?
    if state.diamond.selectedFacet >= 0 {
        selectedFacet = state.diamond.facets[state.diamond.selectedFacet]
    } else {
        selectedFacet = nil
    }
    return HomeViewController.Props(
        selectedFacet: selectedFacet
    )
}

private func mapDispatchToActions(dispatch: @escaping DispatchFunction)
        -> HomeViewController.Actions {
    return HomeViewController.Actions()
}

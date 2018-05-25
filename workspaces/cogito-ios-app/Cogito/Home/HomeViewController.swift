//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import AVFoundation
import QRCodeReader
import RxCocoa
import ReSwift
import ReRxSwift
import FontAwesome_swift
import RichString

class HomeViewController: UIViewController, QRCodeReaderViewControllerDelegate, Connectable {
    let connection = Connection(store: appStore,
                                mapStateToProps: mapStateToProps,
                                mapDispatchToActions: mapDispatchToActions)
    @IBOutlet weak var cameraButton: UIButton!
    @IBOutlet weak var previewContainer: UIView!
    @IBOutlet weak var leftShutter: UIView!
    @IBOutlet weak var rightShutter: UIView!
    @IBOutlet weak var selectedFacetView: UIView!
    var embeddedSelectedFacetController: SelectedFacetViewController!
    private let audioSessionDeactivator = DeactivateAudioSessionOnStop()
    private lazy var bleepPlayer: AVAudioPlayer? = {
        guard let url = Bundle.main.url(forResource: "198414__divinux__infobleep", withExtension: "wav") else {
            return nil
        }
        let player = try? AVAudioPlayer(contentsOf: url)
        player?.delegate = self.audioSessionDeactivator
        player?.prepareToPlay()
        return player
    }()

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
        let frame = CGRect(x: 0, y: 0,
                           width: previewContainer.frame.size.width,
                           height: previewContainer.frame.size.height)
        readerVC.view.frame = frame
        let cameraIconLabel = UILabel(frame: frame)
        cameraIconLabel.textAlignment = .center
        let icon = String.fontAwesomeIcon(name: .videoCamera).font(Font.fontAwesome(ofSize: frame.size.width/2))
        cameraIconLabel.attributedText = icon
        cameraIconLabel.textColor = .white
        readerVC.view.insertSubview(cameraIconLabel, at: 0)
        return readerVC
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        connection.bind(\Props.selectedFacet, to: cameraButton.rx.isHidden) { $0 == nil }
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        connection.connect()
        embeddedSelectedFacetController.headerButton.layer.borderWidth = 0
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        readerVC.delegate = self
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        if presentedViewController == nil {
            connection.disconnect()
        }
    }

    @IBAction func scanButtonDown() {
        if props.selectedFacet != nil {
            startScanning()
        }
    }

    @IBAction func scanButtonUpInside() {
        if props.selectedFacet != nil {
            stopScanning()
        }
    }

    @IBAction func scanButtonUpOutside() {
        if props.selectedFacet != nil {
            stopScanning()
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

    func reader(_ reader: QRCodeReaderViewController, didScanResult result: QRCodeReaderResult) {
        DispatchQueue.global().async {
            self.bleep()
        }
        actions.handleScannedQRCode(result.value)
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

    private func bleep() {
        try? AVAudioSession.sharedInstance().setCategory(AVAudioSessionCategoryAmbient)
        try? AVAudioSession.sharedInstance().setActive(true)
        bleepPlayer?.play()
    }

    struct Props {
        let selectedFacet: Identity?
    }

    struct Actions {
        let handleScannedQRCode: (String) -> Void
    }
}

private func mapStateToProps(state: AppState) -> HomeViewController.Props {
    return HomeViewController.Props(
        selectedFacet: state.diamond.selectedFacet()
    )
}

private func mapDispatchToActions(dispatch: @escaping DispatchFunction)
        -> HomeViewController.Actions {
    return HomeViewController.Actions(
        handleScannedQRCode: { qrCodeString in
            if let url = URL(string: qrCodeString) {
                dispatch(URLActions.HandleIncomingURL(url: url))
            }
        }
    )
}

@objc class DeactivateAudioSessionOnStop: NSObject, AVAudioPlayerDelegate {
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        try? AVAudioSession.sharedInstance().setActive(false, with: .notifyOthersOnDeactivation)
    }
}

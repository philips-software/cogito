import UIKit
import ReSwift
import RxSwift
import ReRxSwift
import RichString
import QRCodeReader
import FontAwesome_swift

class CurrentIdentityViewController: UIViewController, QRCodeReaderViewControllerDelegate, Connectable {
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var cameraButton: UIButton!
    @IBOutlet weak var previewContainer: UIView!
    @IBOutlet weak var leftShutter: UIView!
    @IBOutlet weak var rightShutter: UIView!

    override func viewDidLoad() {
        super.viewDidLoad()

        connection.bind(\Props.selectedFacet, to: nameLabel.rx.attributedText) {
            "I am ".font(UIFont.systemFont(ofSize: 17)) +
            ($0?.formatted() ?? NSAttributedString())
        }
    }

    override func viewWillAppear(_ animated: Bool) {
        self.navigationController?.navigationBar.setBackgroundImage(nil, for: .default)
        self.navigationController?.navigationBar.isTranslucent = false
        navigationController?.navigationBar.shadowImage = nil
        super.viewWillAppear(animated)
        connection.connect()
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        if presentedViewController == nil {
            connection.disconnect()
        }
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let destination = segue.destination as? FacetDetailsViewController {
            destination.facet = props.selectedFacet
            destination.destroyAction = destroyIdentity
        }
    }

    func destroyIdentity() {
        let alert = UIAlertController(
            title: "Destroy identity",
            message: "You will forever loose access to this identity. You cannot undo this.",
            preferredStyle: .alert)
        alert.addAction(UIAlertAction(
            title: "Cancel",
            style: .cancel,
            handler: nil))
        alert.addAction(UIAlertAction(
            title: "Destroy",
            style: .destructive,
            handler: { _ in
                if let uuid = self.props.selectedFacet?.identifier {
                    self.actions.destroyIdentity(uuid)
                    self.navigationController?.popToRootViewController(animated: true)
                }
        }))
        self.present(alert, animated: true, completion: nil)
    }

    // MARK: - QR Code Reading

    lazy var readerVC: QRCodeReaderViewController = {
        let builder = QRCodeReaderViewControllerBuilder {
            $0.reader = QRCodeReader(metadataObjectTypes: [.qr], captureDevicePosition: .back)
            $0.showCancelButton = false
            $0.showOverlayView = false
            $0.showSwitchCameraButton = false
            $0.startScanningAtLoad = false
        }

        let readerVC = QRCodeReaderViewController(builder: builder)
        addChild(readerVC)
        previewContainer.insertSubview(readerVC.view, at: 0)
        let frame = CGRect(x: 0, y: 0,
                           width: previewContainer.frame.size.width,
                           height: previewContainer.frame.size.height)
        readerVC.view.frame = frame
        let cameraIconLabel = UILabel(frame: frame)
        cameraIconLabel.textAlignment = .center
        let icon = String
            .fontAwesomeIcon(name: .video)
            .font(Font.fontAwesome(ofSize: frame.size.width/2, style: .solid))
        cameraIconLabel.attributedText = icon
        cameraIconLabel.textColor = .white
        readerVC.view.insertSubview(cameraIconLabel, at: 0)
        return readerVC
    }()

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        readerVC.delegate = self
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
        actions.handleScannedQRCode(result.value)
        stopScanning()
    }

    func readerDidCancel(_ reader: QRCodeReaderViewController) {
        stopScanning()
    }

    // MARK: - Connection

    let connection = Connection(store: appStore,
                                mapStateToProps: mapStateToProps,
                                mapDispatchToActions: mapDispatchToActions)
    struct Props {
        let selectedFacet: Identity?
    }

    struct Actions {
        let handleScannedQRCode: (String) -> Void
        let destroyIdentity: (UUID) -> Void
    }
}

private func mapStateToProps(state: AppState) -> CurrentIdentityViewController.Props {
    return CurrentIdentityViewController.Props(
        selectedFacet: state.diamond.selectedFacet()
    )
}

private func mapDispatchToActions(dispatch: @escaping DispatchFunction)
    -> CurrentIdentityViewController.Actions {
        return CurrentIdentityViewController.Actions(
            handleScannedQRCode: { qrCodeString in
                if let url = URL(string: qrCodeString) {
                    dispatch(URLActions.HandleIncomingURL(url: url))
                }
            },
            destroyIdentity: { uuid in
                dispatch(DiamondActions.DeleteFacet(uuid: uuid))
            }
        )
}

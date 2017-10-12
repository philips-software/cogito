//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import UIKit

class CameraButton: UIButton {

    var normalColor: UIColor = .darkGray
    @IBInspectable var highlightColor: UIColor = .lightGray

    override func awakeFromNib() {
        super.awakeFromNib()
        configure()
    }

    override func prepareForInterfaceBuilder() {
        super.prepareForInterfaceBuilder()
        configure()
    }

    func configure() {
        self.adjustsImageWhenHighlighted = false
        normalColor = tintColor

        layer.borderColor = normalColor.cgColor
        layer.borderWidth = 2
        layer.cornerRadius = bounds.size.width / 2
        layer.masksToBounds = true

        if let normalImage = image(for: .normal) {
            setImage(normalImage.withRenderingMode(.alwaysTemplate), for: .normal)
        }
    }

    override var isHighlighted: Bool {
        get {
            return super.isHighlighted
        }
        set {
            super.isHighlighted = newValue
            layer.borderColor = newValue ? highlightColor.cgColor : normalColor.cgColor
            tintColor = newValue ? highlightColor : normalColor
        }
    }
}

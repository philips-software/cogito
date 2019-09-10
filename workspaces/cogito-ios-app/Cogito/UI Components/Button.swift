import UIKit

@IBDesignable
class Button: UIButton {

    func configure() {
        setBackgroundImage(UIImage.with(color: UIColor.tinted), for: .normal)
        setBackgroundImage(UIImage.with(color: UIColor.disabled), for: .disabled)
        self.titleLabel?.textColor = .white
        let font = UIFont(name: "American Typewriter", size: 17)!
        let bold = font.fontDescriptor.withSymbolicTraits(UIFontDescriptor.SymbolicTraits.traitBold)!
        self.titleLabel?.font = UIFont(descriptor: bold, size: 17)
        self.layer.cornerRadius = 5
        self.clipsToBounds = true
        self.contentEdgeInsets = UIEdgeInsets(top: 10, left: 0, bottom: 10, right: 0)
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        configure()
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }

    override func awakeFromNib() {
        super.awakeFromNib()
        configure()
    }

    override func prepareForInterfaceBuilder() {
        configure()
    }
}

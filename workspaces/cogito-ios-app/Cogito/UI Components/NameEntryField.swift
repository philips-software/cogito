import UIKit

@IBDesignable
class NameEntryField: UITextField {
    static var nameFont = boldTypewriter17

    var effectiveAscender: CGFloat = 0

    func configure() {
        self.borderStyle = .none
        self.font = NameEntryField.nameFont
        self.effectiveAscender = NameEntryField.nameFont.ascender
        self.contentVerticalAlignment = .top
        self.clipsToBounds = false
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        self.configure()
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }

    override func awakeFromNib() {
        super.awakeFromNib()
        self.configure()
    }

    override func prepareForInterfaceBuilder() {
        self.configure()
    }

    override func draw(_ rect: CGRect) {
        super.draw(rect)
        if let ctx = UIGraphicsGetCurrentContext() {
            let color = self.textColor ?? .black
            ctx.setStrokeColor(color.cgColor)
            ctx.setLineWidth(2)
            let ypos = effectiveAscender + 2
            ctx.move(to: CGPoint(x: 0, y: ypos))
            ctx.addLine(to: CGPoint(x: self.frame.size.width, y: ypos))
            ctx.drawPath(using: .stroke)
        }
    }
}

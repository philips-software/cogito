import UIKit

let typewriter17 = UIFont(name: "American Typewriter", size: 17)!
let boldTypewriter17: UIFont = {
    let bold = typewriter17.fontDescriptor.withSymbolicTraits(UIFontDescriptor.SymbolicTraits.traitBold)!
    return UIFont(descriptor: bold, size: 17)
}()

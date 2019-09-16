import UIKit

let typewriter = UIFont(name: "American Typewriter", size: 19)!
let boldTypewriter: UIFont = {
    let bold = typewriter.fontDescriptor.withSymbolicTraits(UIFontDescriptor.SymbolicTraits.traitBold)!
    return UIFont(descriptor: bold, size: 19)
}()

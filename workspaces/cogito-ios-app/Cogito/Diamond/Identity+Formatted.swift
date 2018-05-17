//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import RichString
import FontAwesome_swift

private let formattedIdentityFontSize = CGFloat(30)
private let formattedIdentityFont = UIFont(name: "Snell Roundhand", size: formattedIdentityFontSize)
                                    ?? UIFont.italicSystemFont(ofSize: formattedIdentityFontSize)

extension Identity {
    func formatted(addSpacePadding: Int = 0) -> NSAttributedString {
        let hasAttestations = self.openIDTokens.count > 0
        let spacePadding = [Int](0..<addSpacePadding).map { _ in " " }.joined()
        var text = spacePadding + self.description
        if !hasAttestations { text += spacePadding }
        let description = text.font(formattedIdentityFont)
        if hasAttestations {
            let icon = String.fontAwesomeIcon(name: .sunO)
                .font(Font.fontAwesome(ofSize: formattedIdentityFontSize/2))
                .color(UIColor(red: 0.1, green: 0.8, blue: 0.1, alpha: 1))
            return description + "  ".font(formattedIdentityFont) + icon
        } else {
            return description
        }
    }
}

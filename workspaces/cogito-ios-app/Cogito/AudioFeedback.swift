//  Copyright © 2019 Koninklijke Philips Nederland N.V. All rights reserved.
import AVFoundation

class AudioFeedback {
    static var `default` = AudioFeedback()

    var identitySelected: IdentitySelected?
    var disabled = false

    func playIdentitySelected() {
        guard !disabled else { return }
        identitySelected = IdentitySelected()
        identitySelected?.play()
    }

    class IdentitySelected {
        private let player: AVAudioPlayer

        init?() {
            guard let url = Bundle.main.url(forResource: "198414__divinux__infobleep", withExtension: "wav"),
                let newPlayer = try? AVAudioPlayer(contentsOf: url) else {
                    return nil
            }
            player = newPlayer
            player.delegate = self.audioSessionDeactivator
            self.player.prepareToPlay()
        }

        private let audioSessionDeactivator = DeactivateAudioSessionOnStop()

        func play() {
            DispatchQueue.global().async {
                try? AVAudioSession.sharedInstance().setCategory(.ambient, mode: .default, options: [])
                try? AVAudioSession.sharedInstance().setActive(true)
                self.player.play()
            }
        }
    }
}

@objc class DeactivateAudioSessionOnStop: NSObject, AVAudioPlayerDelegate {
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
    }
}

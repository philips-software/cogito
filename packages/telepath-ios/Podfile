platform :ios, '11.0'
use_frameworks!
inhibit_all_warnings!

target 'Telepath' do
  podspec

  target 'TelepathTests' do
    # Latest versions from master needed for Swift 4 compatibility:
    pod 'Quick', :git => 'https://github.com/Quick/Quick'
    pod 'Nimble', :git => 'https://github.com/Quick/Nimble'
    pod 'STRegex', '~> 1.1'
    pod 'SwiftLint', '0.21.0'
    pod 'Mockingjay', git: 'https://github.com/metaltoad/Mockingjay.git', branch: 'mt-swift4'
  end
end

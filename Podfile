platform :ios, '11.0'
use_frameworks!

target 'Telepath' do
  pod 'RNCryptor', '~> 5.0'
  pod 'SwiftyBase64', '~> 1.1'
  pod 'SwiftBytes', '~> 0.6'

  target 'TelepathTests' do
    # Latest versions from master needed for Swift 4 compatibility:
    pod 'Quick', :git => 'https://github.com/Quick/Quick'
    pod 'Nimble', :git => 'https://github.com/Quick/Nimble'
  end
end

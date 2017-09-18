platform :ios, '10.0'

target 'Cogito' do
  use_frameworks!

  pod 'ReSwift', :git => 'https://github.com/ReSwift/ReSwift', :branch => 'mjarvis/swift-4'
  pod 'ReSwiftThunk', :git => 'https://github.com/mikecole20/ReSwiftThunk.git', :branch => 'swift4.0'

  target 'CogitoTests' do
    inherit! :search_paths
    pod 'Quick', :git => 'https://github.com/Quick/Quick'
    pod 'Nimble', :git => 'https://github.com/Quick/Nimble'
  end

end

Pod::Spec.new do |spec|
  spec.name = 'Telepath'
  spec.version = '0.1.0'
  spec.license = { type: 'proprietary', file: 'License.txt' }
  spec.homepage = 'https://gitlab.ta.philips.com/blockchain-lab/telepath-ios'
  spec.authors = 'The Telepath authors'
  spec.summary = 'Provides a secure channel for communication between a web app running in a browser and an app running on a mobile device.'
  spec.ios.deployment_target = '11.0'
  spec.source = {
    git: 'https://gitlab.ta.philips.com/blockchain-lab/telepath-ios.git',
    tag: spec.version
  }
  spec.source_files = 'Telepath/**/*.swift'
  spec.dependency 'Sodium', '~> 0.5'
  spec.dependency 'base64url', '~> 1.0'
end

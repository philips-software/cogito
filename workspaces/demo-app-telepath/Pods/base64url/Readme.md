Base64 URL for Swift
================

Supports conversion to and from the [base64 URL format][1]. This format differs from normal base64
in that it only includes characters that can be used safely in a URL.

Installation
------------

You can add this framework to your Xcode project using [CocoaPods][2]. Add the following to your Podfile:

```
pod 'base64url', '~> 1.0'
```

Usage
-------

Convert a Data struct into a base64url string:

```swift
Data(bytes: [255, 1, 2]).base64urlEncodedString() // equals "_wEC"
```

Convert base64url string into a Data struct:

```swift
Data(base64urlEncoded: "AAECAw") // equals Data(bytes: [0, 1, 2, 3])
```

[1]: https://tools.ietf.org/html/rfc4648#section-5
[2]: https://cocoapods.org

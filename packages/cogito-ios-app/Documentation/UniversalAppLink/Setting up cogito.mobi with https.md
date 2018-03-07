Setting up https://cogito.mobi
==============================


Amazon Setup
============

Unless explicitly stated otherwise, all objects below are created in region `eu-central-1` (Frankfurt).

S3
--
* Create S3 bucket called 'cogito.mobi'
    - public access
    - web site hosting enabled; specify `index.html`

Certificate Manager
-------------------
* Create certificate for `*.cogito.mobi` and `cogito.mobi` (i.e. together, one certificate). Make sure it is in region US East (N. Virginia) otherwise CloudFront will not be able to use it.
* Make sure validation succeeds before continuing (is this needed??)

CloudFront
----------

* Create CloudFront distribution with at least these properties:
    - Delivery method: web
    - Origin domain name: `cogito.mobi.s3-website.eu-central-1.amazonaws.com` (i.e. the URL including the region)
    - Viewer Protocol Policy: HTTPS only
    - Price Class: US, Canada, Europe
    - Alternate Domain Names: cogito.mobi
    - SSL Certificate: Custom SSL Certificate; select the one created above
    - Custom SSL Client Support: SNI

Route 53
--------
* Create record set:
    - Name: (empty) -> will use `cogito.mobi`
    - Type: A
    - Alias: Yes
        - select the CloudFront distribution as target

Options Not Pursued
-------------------
* S3 can be restricted so that it can only be served through CloudFront, not directly. See [AWS docs on Origin Access Identity][1] for more information.
* It should be possible to configure HTTP -> HTTPS redirection in CloudFront, but this didn't work when I tried it.
* It should be possible to configure `www.cogito.mobi` -> `cogito.mobi` redirect. Something like this:
    - Create S3 bucket for `www.cogito.mobi` with same settings as above, except static web hosting: configure it to redirect.
    - Add `www.cogito.mobi` in CloudFront to the alternate domain names setting.
    - Add CNAME record in Route 53 for `www` with value `cogito.mobi`.


Universal Link Setup
====================
For the universal link to the app to work, the file `apple-app-site-association`
needs to be stored in the root of the S3 bucket. It must have content type
`application/json` and publicly accessible using the domain https://cogito.mobi.
You can use the [Branch.io validator][2] to check that the file is deployed correctly.


[1]: http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
[2]: https://branch.io/resources/aasa-validator/

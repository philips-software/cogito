---
path: /components/telepath-queuing-service
title: Telepath Queuing Service
tag: component
---

Simple Queueing Service for use with Telepath. Allows two Telepath clients to
communicate when they are behind a distinct NAT.

## Usage

```bash
» cd telepath-queuing-service
» yarn start
```

`telepath-queuing-service` is listening on port `3000` and you can use [httpie](https://httpie.org) (`brew install httpie`) to verify that the queueing service works:

```bash
# write something do the queue with queue id "hond"
» http POST :3000/hond body='likes to chase cats'
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 0
Date: Tue, 06 Feb 2018 16:33:54 GMT
X-Powered-By: Express
```

To read back from the queue `hond` we do this:

```bash
# read back from the queue
» http :3000/hond
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 23
Content-Type: text/html; charset=utf-8
Date: Tue, 06 Feb 2018 16:34:04 GMT
ETag: W/"17-P/sADWb+ZvqryBhtyfknr18yII4"
X-Powered-By: Express

{
    "body": "likes to chase cats"
}
```

Attempt to read from an empty or non-existing queue, will result in `204 No Content` response:

```bash
» http :3000/hond
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Connection: keep-alive
Date: Tue, 06 Feb 2018 16:34:06 GMT
X-Powered-By: Express
```

## Easy deployment with 'now'

[now](https://zeit.co/now) from [zeit](https://zeit.co) allows you to put your app *up there* in minutes.
*now* supports static web apps, node.js, and docker based deployments.
In order to take advantage of this deployment method follow the [Get Started](https://zeit.co/now#get-started) steps. When running `now` command, you will be given an option to select between *docker* and *npm* deployment. This is because our project includes `Dockerfile`. Here is an example deployment:

```bash
» now
> Deploying ~/Documents/Projects/Philips/BLOCKCHAIN/Cogito/telepath-queuing-service under marcin@example.com
> Two manifests found. Press [n] to deploy or re-run with --flag
> [1] package.json         --npm
> [2] Dockerfile        --docker
> Using Node.js 9.4.0 (requested: `>=7.6.0`)
> Ready! https://telepath-queuing-service-<some-random-string>.now.sh (copied to clipboard) [5s]
> You (marcin@example.com) are on the OSS plan. Your code and logs will be made public.
> NOTE: You can use `now --public` to skip this prompt
> Initializing…
> Building
> ▲ npm install
> ✓ Using "yarn.lock"
> ⧗ Installing 8 main dependencies…
> ✓ Installed 423 modules [8s]
> ▲ npm start
> > telepath-queuing-service@0.1.0 start /home/nowuser/src
> > node ./index
> Telepath Queueing Service running on port 3000
> Deployment complete!
```

Both deployment options are fine and will work. After deployment, you can use [httpie](https://httpie.org) (`brew install httpie`) to verify that the queueing service works:

> Use the url you received during deployment.

```bash
# write something do the queue with queue id "pies"
» http --verify=no POST https://telepath-queuing-service-<some-random-string>.now.sh/pies body='likes to chase cats'
HTTP/1.1 200 OK
Accept-Ranges: bytes
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 0
Date: Tue, 06 Feb 2018 16:00:30 GMT
Server: now
X-Now-Region: now-bru
X-Powered-By: Express
```

To read back from the queue `pies` we do this:

```bash
» http --verify=no https://telepath-queuing-service-<some-random-string>.now.sh/pies
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
Date: Tue, 06 Feb 2018 16:00:49 GMT
ETag: W/"17-P/sADWb+ZvqryBhtyfknr18yII4"
Server: now
Transfer-Encoding: chunked
X-Now-Region: now-bru
X-Powered-By: Express

{
    "body": "likes to chase cats"
}
```

Attempt to read from an empty queue, will result in `204 No Content` response:

```bash
» http --verify=no https://telepath-queuing-service-<some-random-string>.now.sh/pies
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Connection: keep-alive
Date: Tue, 06 Feb 2018 16:00:53 GMT
Server: now
X-Now-Region: now-bru
X-Powered-By: Express
```

## Cloud deployment using Terraform

A [Terraform][terraform] script to deploy to Amazon Web Services is included. Adapt the
script to match your own Amazon environment, domain name and ssl certificate.
Update the version number at the top of the script if necessary.
Deploy to Amazon by issuing the following commands:

    rm -rf node_modules
    terraform init
    terraform plan
    terraform apply

[terraform]: https://terraform.io

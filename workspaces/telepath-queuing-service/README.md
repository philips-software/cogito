# telepath-queuing-service

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

## Deploy

Use [now](https://zeit.co/now) to deploy. Now configuration is included in the
`now.json` file.

```bash
# write something do the queue with queue id "pies"
» http --verify=no POST https://telepath.cogito.mobi/pies body='likes to chase cats'
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
» http --verify=no https://telepath.cogito.mobi/pies
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
» http --verify=no https://telepath.cogito.mobi/pies
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Connection: keep-alive
Date: Tue, 06 Feb 2018 16:00:53 GMT
Server: now
X-Now-Region: now-bru
X-Powered-By: Express
```

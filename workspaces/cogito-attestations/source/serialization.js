import base64url from 'base64url'

export function serialize (object) {
  return base64url(JSON.stringify(object))
}

export function deserialize (string) {
  return JSON.parse(base64url.decode(string))
}

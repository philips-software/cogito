# OpenID for the rest of us

In this document I include some handy links and not so obvious information about OpenID.

## Brief introduction to OpenId

You may want to take a look at [OpenID Connect explained].

In the following section we put the most important insights

## Authentication flows

There are three authentication flows: *authorization code flow*, *implicit flow*, and *hybrid flow*. The hybrid flow is rarely used and so here we focus on the first two.

The *authorization code flow* is used in traditional backend-based apps and in native apps (like those for iOS and Android). In this flow the, when the user initiates the login action (e.g. by clicking *login* button the page) the browser redirects to a so-called *authorization endpoint* where the user can input her login credentials. Besides other parameters, the request will include the `response_type` set to `code` to indicate the authorization flow and `redirect_uri` callback URI. After successful authentication the OpenID provider (OP) will call the client `redirect_uri` with an authorization code. Effectively the redirect request with the authorization code will end up on the server. The server will use the *token endpoint* of the OP and the received authorization code to retrieve the ID token. Notice that in the authorization code flow the ID token is not directly exposed to the browser.

In the *implicit flow*, all tokens are returned from the Authorization Endpoint; the Token Endpoint is not used. On successful authentication the OP responds directly with the ID token - thus, the ID token is exposed to the browser, thus can be perceived as less secure.

The details about the implicit flow can be found [here](https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth). The authentication request follows the rules for the authentication code flow as described in [Section 3.1.2.1](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest) of the [OpenID Connect Core Specification].

Our Cogito App also uses the implicit flow to authenticate with our open id provider. Below are the request parameters from used by Cogito App:

- `response_type`: id_token
- `client_id`: cogito
- `redirect_uri`: https://cogito.mobi/applinks/openid-callback
- `nonce`: e37976ef5c561f67574b365a8a5fe6e35f0c201ba5749dfd96158e27808a17d3

And below is the complete url with all params:

```
"https://iam-blockchain-dev.cogito.mobi/auth/realms/master/protocol/openid-connect/auth?response_type=id_token&client_id=cogito&redirect_uri=https://cogito.mobi/applinks/openid-callback&scope=openid&nonce=e37976ef5c561f67574b365a8a5fe6e35f0c201ba5749dfd96158e27808a17d3"
```



And here is an example of a successful response from the OpenID provider:

```
https://cogito.mobi/applinks/openid-callback#id_token=eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJRXy05VHhHLWxQUkpIMlVJZ3FHQkZDekVBenZvOVQ0amZTLWExZUx0M1k0In0.eyJqdGkiOiIwYzU1OTFlYi00MzZjLTQ4NjctYTEzOC1hMDEzM2MxN2U4NDgiLCJleHAiOjE1MTgxMzI5OTgsIm5iZiI6MCwiaWF0IjoxNTE4MTMyMDk4LCJpc3MiOiJodHRwczovL2lhbS1ibG9ja2NoYWluLWRldi5jb2dpdG8ubW9iaS9hdXRoL3JlYWxtcy9tYXN0ZXIiLCJhdWQiOiJjb2dpdG8iLCJzdWIiOiJkMGVmNTEwNy0wZjI1LTQ5OTUtODIwMS02MTliNWFjY2Y5MmQiLCJ0eXAiOiJJRCIsImF6cCI6ImNvZ2l0byIsIm5vbmNlIjoiZTVlNjhhMDk2OGI3MGI4MjE5MDQzZjE1YmEyNGM2ZTEwYjk2Mzc2MjEyMTdlMTNmOTNjNzg2YjQ4YmZlZDViZSIsImF1dGhfdGltZSI6MTUxODEzMjA5OCwic2Vzc2lvbl9zdGF0ZSI6IjczODM4ZTE0LTVlYzgtNDUwNy04OWZmLTZhMTAxNjM2NmY0OSIsImFjciI6IjEiLCJuYW1lIjoiRGVtbyBVc2VyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZGVtbyIsImdpdmVuX25hbWUiOiJEZW1vIiwiZmFtaWx5X25hbWUiOiJVc2VyIiwiZW1haWwiOiJkZW1vQGV4YW1wbGUuY29tIn0.GD0FpRvrVEwRRqJ5CrCkiDl6ss7J-QqznKwQF1LpugBqTK88DG_yBKzZhUIYN3ie9rfY75KL3h_CjJ9seXNe3YMWmxYfTiEG6ShqolS_JkCwpExFS64wj0IgergxMLWpkoExen8hHSmQL2UW7VeuK1eX31Tm2nLkp_8Bf
```

## OpenID provider configuration discovery

OpenID Connect defines a mechanism for an OpenID Connect Relying Party to discover the End-User's OpenID Provider and obtain information needed to interact with it, including its OAuth 2.0 endpoint locations.

The [OpenID Provider Configuration Request] describes the details. For our identity provider the URI is:

```
https://iam-blockchain-dev.cogito.mobi/auth/realms/master/.well-known/openid-configuration
```

It returns:

```
{
  "issuer":"https://iam-blockchain-dev.cogito.mobi/auth/realms/master",
  "authorization_endpoint":"https://iam-blockchain-dev.cogito.mobi/auth/realms/master/protocol/openid-connect/auth",
  "token_endpoint":"https://iam-blockchain-dev.cogito.mobi/auth/realms/master/protocol/openid-connect/token",
  "token_introspection_endpoint":"https://iam-blockchain-dev.cogito.mobi/auth/realms/master/protocol/openid-connect/token/introspect",
  "userinfo_endpoint":"https://iam-blockchain-dev.cogito.mobi/auth/realms/master/protocol/openid-connect/userinfo",
  "end_session_endpoint":"https://iam-blockchain-dev.cogito.mobi/auth/realms/master/protocol/openid-connect/logout",
  "jwks_uri":"https://iam-blockchain-dev.cogito.mobi/auth/realms/master/protocol/openid-connect/certs",
  "check_session_iframe":"https://iam-blockchain-dev.cogito.mobi/auth/realms/master/protocol/openid-connect/login-status-iframe.html",
  "grant_types_supported":["authorization_code","implicit","refresh_token","password","client_credentials"],
  "response_types_supported":["code","none","id_token","token","id_token token","code id_token","code token","code id_token token"],
  "subject_types_supported":["public","pairwise"],
  "id_token_signing_alg_values_supported":["RS256"],
  "userinfo_signing_alg_values_supported":["RS256"],
  "request_object_signing_alg_values_supported":["none","RS256"],
  "response_modes_supported":["query","fragment","form_post"],
  "registration_endpoint":"https://iam-blockchain-dev.cogito.mobi/auth/realms/master/clients-registrations/openid-connect",
  "token_endpoint_auth_methods_supported":["private_key_jwt","client_secret_basic","client_secret_post"],
  "token_endpoint_auth_signing_alg_values_supported":["RS256"],
  "claims_supported":["sub","iss","auth_time","name","given_name","family_name","preferred_username","email"],
  "claim_types_supported":["normal"],
  "claims_parameter_supported":false,
  "scopes_supported":["openid","offline_access"],
  "request_parameter_supported":true,
  "request_uri_parameter_supported":true
}
```

[OpenID Connect explained]: https://connect2id.com/learn/openid-connect

[OpenID Connect Core Specification]: https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth

[OpenID Provider Configuration Request]: https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfigurationRequest

## Keycloak - our OpenID Provider

### Accounts

Our account user names and passwords can be found in our keybase blockchainlab team folder.

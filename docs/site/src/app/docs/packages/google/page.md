---
title: '@smartsoft001/google'
section: Packages
order: 30
package: '@smartsoft001/google'
nextjs:
  metadata:
    title: '@smartsoft001/google'
    description: 'GoogleService: two calls to the OAuth tokeninfo endpoint that validate a Google access token against your trusted OAuth client ids and return the user id and email.'
---

One service with two calls: it validates a Google access token, checks that it was issued to your application, and reports the account behind it. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/google @nestjs/axios
```

The manifest declares neither dependencies nor peer dependencies, and the package needs almost nothing: `@nestjs/common` for `@Injectable` and the `HttpService` of `@nestjs/axios` for the two requests. It imports no other `@smartsoft001` package, which is why it can be used on its own, outside the authentication stack it was written for.

## What it is

The Google half of social sign-in. A client that has already completed the Google OAuth flow holds an access token but no identity your application can trust; this service sends that token to the tokeninfo endpoint, which both validates it and reports whose it is. An expired or revoked token, or one issued to another application, is rejected rather than returning an empty answer.

The package exports one class and nothing else. There is no config class, no injection token and no environment variable, but every call takes the list of OAuth client ids your application trusts. A Google access token issued to any app identifies its user just as well, so without that check a token obtained by someone else's app would log its user into yours. No client secret is involved, because the token has already been issued and is only being inspected. There is also no NestJS module here: `AuthShellNestjsModule.forRoot({ tokenConfig })` provides and exports `GoogleService` alongside `FbService`, so an application that imports the auth shell already has it. Register it by hand, as the example does, to use the tokeninfo lookup without the rest of the authentication stack.

Inside that stack the service is called from one place. The token factory of [`@smartsoft001/auth-domain`](/docs/packages/auth-domain) sees a request whose `grant_type` is `google`, calls `getUserId` with the `google_token` from the request and the allowlist from `TokenConfig.googleClientIds`, and then looks the local user up by the `googleUserId` column, so the tokeninfo answer is what links a Google account to a user record.

## Usage

{% snippet file="node/src/google/google-service.example.ts" region="usage" /%}

The region wraps the package service in an application service rather than injecting it directly everywhere, which keeps the allowlist and the tokeninfo call in one place, and registers both in a module that imports `HttpModule` for the `HttpService` the constructor asks for. The trusted client ids are provided under their own injection token. In an application they come from server configuration, never from the login request.

Its spec compiles that module with an `HttpService` stub that records the url and answers with a canned tokeninfo response: `user_id: '42'`, `audience` and `issued_to` set to the docs client id, and a positive `expires_in`. It asserts four things. The call returns `42`, which is only true because the service reads `user_id` and not `id`. The url the service would have sent is exactly `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=token`, which pins both the endpoint and the fact that the token travels as a query parameter rather than as a header. A response whose `audience` and `issued_to` name another client is rejected with an `UnauthorizedException`. And the recorded list is still empty before any method has been called, so resolving the provider sends nothing.

## API

### `GoogleService`

Constructed as `new GoogleService(httpService)`, or resolved from the injector. `HttpService` is its only dependency.

| Method                        | Returns                                              | Request                                                                                          |
| ----------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `getUserId(token, clientIds)` | `Promise<string>`, the `user_id` field of the answer | `GET https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={token}`, the token URL-encoded |
| `getData(token, clientIds)`   | `Promise<{ email; id }>`                             | the same request, reshaped into `{ id: data.user_id, email: data.email }`                        |

`clientIds` is a required `readonly string[]`: the OAuth client ids your application trusts. A token is accepted only when the tokeninfo answer has a non-empty `user_id`, an `audience` and an `issued_to` that are both in `clientIds`, and an `expires_in` that is a positive finite number.

Both methods hit the same endpoint, so `getData` costs no more than `getUserId`. The reshaping is the only difference, and it is what hides the endpoint's own naming: the identifier is `user_id` in the response and `id` in everything this package hands back.

Every failure is an `UnauthorizedException` from `@nestjs/common`. An empty `clientIds`, an empty token or one longer than 8192 characters fails closed with `Invalid Google token or client configuration` before any request is made. A response that fails the checks above, and any error from the request itself, becomes `Invalid Google token`. The original HTTP error is dropped on purpose, because its request url carries the access token. There is no retry and no timeout of their own.

The check still relies on Google's tokeninfo answer. This is not an ID-token (JWT) verifier, and it does not change the login protocol: the client still sends an access token.

{% callout type="warning" title="Migrating from 2.182.0 or earlier" %}
`getUserId(token)` and `getData(token)` without an allowlist no longer compile. Pass the OAuth client ids of your own application, loaded from trusted server configuration, and never a list taken from the request. An empty list rejects every token. Through the auth stack, set `TokenConfig.googleClientIds`, see [`@smartsoft001/auth-domain`](/docs/packages/auth-domain). A test double of the HTTP call must now answer with `audience`, `issued_to` and `expires_in`, and a spec that expected the raw HTTP error must expect `Invalid Google token`.
{% /callout %}

{% callout type="note" title="The token is sent in the query string" %}
Both requests put the access token in the url, URL-encoded as a single parameter. That is what the tokeninfo endpoint accepts, but it means the token can appear in access logs, proxy logs and error reports that record full urls. Keep whatever logs these requests from recording query strings, and treat a captured url as a captured credential.
{% /callout %}

## Related packages

- [`@smartsoft001/auth-domain`](/docs/packages/auth-domain) calls `getUserId` from its token factory when a token request arrives with `grant_type: 'google'`, passing `TokenConfig.googleClientIds`.
- [`@smartsoft001/auth-shell-nestjs`](/docs/packages/auth-shell-nestjs) provides and exports this service, so importing that module is the usual way to get it.
- [`@smartsoft001/fb`](/docs/packages/fb) is the same service for Facebook, exported from the same module and called from the same factory.

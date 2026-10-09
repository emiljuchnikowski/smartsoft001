---
title: '@smartsoft001/fb'
section: Packages
order: 29
package: '@smartsoft001/fb'
nextjs:
  metadata:
    title: '@smartsoft001/fb'
    description: 'FbService: verifies a Facebook access token with debug_token against your trusted app ids, then turns it into a user id and an email.'
---

One service with two calls: it checks that a Facebook access token was issued to your application and turns it into the account behind it. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/fb @nestjs/axios
```

The manifest declares neither dependencies nor peer dependencies, and the package needs almost nothing: `@nestjs/common` for `@Injectable` and the `HttpService` of `@nestjs/axios` for the two requests. It imports no other `@smartsoft001` package, which is why it can be used on its own, outside the authentication stack it was written for.

## What it is

The Facebook half of social sign-in. A client that has already completed the Facebook login flow holds an access token but no identity your application can trust; this service asks the Graph API `debug_token` endpoint whether the token is valid, which app it was issued to and whose it is. An invalid or expired token, or one issued to another app, is rejected rather than returning an empty answer.

The package exports one class and one interface, `IFbAppCredentials`. There is no config class, no injection token and no environment variable, but every call takes the list of Facebook app ids your application trusts and the id and secret of the app that asks `debug_token`. A Facebook access token granted to any app identifies its user just as well, and `/me` answers for all of them, so without that check a token the user granted to someone else's app would log them into yours. There is also no NestJS module here: `AuthShellNestjsModule.forRoot({ tokenConfig })` provides and exports `FbService` alongside `GoogleService`, so an application that imports the auth shell already has it. Register it by hand, as the example does, to use the Graph lookup without the rest of the authentication stack.

Inside that stack the service is called from one place. The token factory of [`@smartsoft001/auth-domain`](/docs/packages/auth-domain) sees a request whose `grant_type` is `fb`, calls `getUserId` with the `fb_token` from the request, the allowlist from `TokenConfig.fbAppIds` and the credentials from `TokenConfig.fbAppCredentials`, and then looks the local user up by the `facebookUserId` column, so the `debug_token` answer is what links a Facebook account to a user record.

## Usage

{% snippet file="node/src/fb/fb-service.example.ts" region="usage" /%}

The region wraps the package service in an application service rather than injecting it directly everywhere, which keeps the allowlist, the credentials and the Graph calls in one place, and registers both in a module that imports `HttpModule` for the `HttpService` the constructor asks for. The trusted app ids and the app credentials are provided under their own injection tokens. In an application they come from server configuration, never from the login request, and the secret never leaves the server.

Its spec compiles that module with an `HttpService` stub that records the url and answers with a canned `debug_token` response: `is_valid: true`, `app_id` set to the docs app id and `user_id: '42'`. It asserts four things. The call returns `42`, the `user_id` of that answer. The url the service would have sent is exactly `https://graph.facebook.com/debug_token?input_token=token&access_token=1234567890%7Cdocs-app-secret`, which pins the endpoint, the URL-encoded app access token `<appId>|<appSecret>`, and the fact that both tokens travel as query parameters rather than as a header. A response whose `app_id` names another app is rejected with an `UnauthorizedException`. And the recorded list is still empty before any method has been called, so resolving the provider sends nothing.

## API

### `FbService`

Constructed as `new FbService(httpService)`, or resolved from the injector. `HttpService` is its only dependency.

| Method                                  | Returns                                       | Requests                                                                                                      |
| --------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `getUserId(token, appIds, credentials)` | `Promise<string>`, the `user_id` of the token | `GET https://graph.facebook.com/debug_token?input_token={token}&access_token={appId}\|{appSecret}`            |
| `getData(token, appIds, credentials)`   | `Promise<{ id; email }>`                      | the same `debug_token` request, then `GET https://graph.facebook.com/me?fields=email,id&access_token={token}` |

Every value in a url is URL-encoded. `appIds` is a required `readonly string[]`: the Facebook app ids your application trusts. `credentials` is a required `IFbAppCredentials`, `{ appId: string; appSecret: string }`, the app whose app access token `<appId>|<appSecret>` authenticates the `debug_token` call; usually it is your own app, also listed in `appIds`. A token is accepted only when the answer has `data.is_valid` equal to `true`, a `data.app_id` in `appIds`, and a non-empty string `data.user_id`.

`getUserId` makes that one request and returns `data.user_id`, which is the app-scoped id that `/me` would also report. `getData` reads `/me` only once the token has passed, requires the profile `id` to equal the verified `user_id`, and returns the profile body otherwise unchanged. An account that has not granted the email permission answers without an `email`, and the call still succeeds.

When `data.app_id` equals `credentials.appId`, `getData` adds `&appsecret_proof={proof}` to the `/me` request, where the proof is the hex HMAC-SHA256 of the user access token keyed with `credentials.appSecret`. Graph then accepts the call only from a server that holds the secret of the app the token was issued to, which is what Facebook's "Require App Secret" setting enforces. A token of another app in `appIds` has no configured secret, so its `/me` request is sent without a proof, as before. Neither the secret nor the proof is logged.

Every failure is an `UnauthorizedException` from `@nestjs/common`. An empty `appIds`, a missing app id or secret, an empty token or one longer than 8192 characters fails closed with `Invalid Facebook token or app configuration` before any request is made. A `debug_token` answer that fails the checks above, a mismatched profile, and any error from either request become `Invalid Facebook token`. The original HTTP error is dropped on purpose, because its request url carries the access token and the app secret. There is no retry and no timeout of their own.

{% callout type="warning" title="Migrating from 2.188.0 or earlier" %}
`getUserId(token)` and `getData(token)` without an allowlist and credentials no longer compile. Pass the app ids of your own application and the app id and secret, all loaded from trusted server configuration, and never a list taken from the request. An empty list rejects every token. Through the auth stack, set `TokenConfig.fbAppIds` and `TokenConfig.fbAppCredentials`, see [`@smartsoft001/auth-domain`](/docs/packages/auth-domain). `getUserId` now calls `debug_token` instead of `/me`, so a test double of the HTTP call must answer with `{ data: { is_valid, app_id, user_id } }`, and a spec that expected the raw HTTP error must expect `Invalid Facebook token`.
{% /callout %}

{% callout type="note" title="Tokens are sent in the query string" %}
The requests put the user access token, and for `debug_token` the app access token with its secret, in the url, URL-encoded as single parameters. That is what the Graph API accepts, but it means both can appear in access logs, proxy logs and error reports that record full urls. Keep whatever logs these requests from recording query strings, and treat a captured url as a captured credential.
{% /callout %}

## Related packages

- [`@smartsoft001/auth-domain`](/docs/packages/auth-domain) calls `getUserId` from its token factory when a token request arrives with `grant_type: 'fb'`, passing `TokenConfig.fbAppIds` and `TokenConfig.fbAppCredentials`.
- [`@smartsoft001/auth-shell-nestjs`](/docs/packages/auth-shell-nestjs) provides and exports this service, so importing that module is the usual way to get it.
- [`@smartsoft001/google`](/docs/packages/google) is the same service for Google, exported from the same module and called from the same factory.

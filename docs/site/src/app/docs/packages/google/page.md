---
title: '@smartsoft001/google'
section: Packages
order: 26
package: '@smartsoft001/google'
nextjs:
  metadata:
    title: '@smartsoft001/google'
    description: 'GoogleService: two calls to the OAuth tokeninfo endpoint that validate a Google access token and return the user id and email, with no configuration of its own.'
---

One service with two calls: it validates a Google access token and reports the account behind it. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/google @nestjs/axios
```

The manifest declares neither dependencies nor peer dependencies, and the package needs almost nothing: `@nestjs/common` for `@Injectable` and the `HttpService` of `@nestjs/axios` for the two requests. It imports no other `@smartsoft001` package, which is why it can be used on its own, outside the authentication stack it was written for.

## What it is

The Google half of social sign-in. A client that has already completed the Google OAuth flow holds an access token but no identity your application can trust; this service sends that token to the tokeninfo endpoint, which both validates it and reports whose it is. An expired or revoked token fails the request rather than returning an empty answer.

The package exports one class and nothing else. There is no config class, no injection token and no environment variable: no client id or secret is involved, because the token has already been issued and is only being inspected. There is also no NestJS module here: `AuthShellNestjsModule.forRoot({ tokenConfig })` provides and exports `GoogleService` alongside `FbService`, so an application that imports the auth shell already has it. Register it by hand, as the example does, to use the tokeninfo lookup without the rest of the authentication stack.

Inside that stack the service is called from one place. The token factory of [`@smartsoft001/auth-domain`](/docs/packages/auth-domain) sees a request whose `grant_type` is `google`, calls `getUserId` with the `google_token` from the request, and then looks the local user up by the `googleUserId` column, so the tokeninfo answer is what links a Google account to a user record.

## Usage

{% snippet file="node/src/google/google-service.example.ts" region="usage" /%}

The region wraps the package service in an application service rather than injecting it directly everywhere, which keeps the tokeninfo call in one place, and registers both in a module that imports `HttpModule` for the `HttpService` the constructor asks for.

Its spec compiles that module with an `HttpService` stub that records the url and answers with a canned `{ data: { user_id: '42' } }`, and asserts three things. The call returns `42`, which is only true because the service reads `user_id` and not `id`. The url the service would have sent is exactly `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=token`, which pins both the endpoint and the fact that the token travels as a query parameter rather than as a header. And the recorded list is still empty before any method has been called, so resolving the provider sends nothing.

## API

### `GoogleService`

Constructed as `new GoogleService(httpService)`, or resolved from the injector. `HttpService` is its only dependency.

| Method             | Returns                                              | Request                                                                   |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------- |
| `getUserId(token)` | `Promise<string>`, the `user_id` field of the answer | `GET https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={token}` |
| `getData(token)`   | `Promise<{ email; id }>`                             | the same request, reshaped into `{ id: data.user_id, email: data.email }` |

Both methods hit the same endpoint, so `getData` costs no more than `getUserId`. The reshaping is the only difference, and it is what hides the endpoint's own naming: the identifier is `user_id` in the response and `id` in everything this package hands back.

Both methods let the underlying request error surface. There is no retry, no timeout of their own and no translation into a domain error, so an invalid token reaches the caller as the HTTP failure Google returned. Note that the endpoint reports which client the token was issued to, in fields this service does not read, so verifying that a token belongs to your own application is left to the caller.

{% callout type="note" title="The token is sent in the query string" %}
Both requests put the access token in the url. That is what the tokeninfo endpoint accepts, but it means the token can appear in access logs, proxy logs and error reports that record full urls. Keep whatever logs these requests from recording query strings, and treat a captured url as a captured credential.
{% /callout %}

## Related packages

- [`@smartsoft001/auth-domain`](/docs/packages/auth-domain) calls `getUserId` from its token factory when a token request arrives with `grant_type: 'google'`.
- [`@smartsoft001/auth-shell-nestjs`](/docs/packages/auth-shell-nestjs) provides and exports this service, so importing that module is the usual way to get it.
- [`@smartsoft001/fb`](/docs/packages/fb) is the same service for Facebook, exported from the same module and called from the same factory.

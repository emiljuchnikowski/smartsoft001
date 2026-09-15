---
title: '@smartsoft001/fb'
section: Packages
order: 25
package: '@smartsoft001/fb'
nextjs:
  metadata:
    title: '@smartsoft001/fb'
    description: 'FbService: two Graph API calls that turn a Facebook access token into a user id and an email, with no configuration of its own.'
---

One service with two calls: it turns a Facebook access token into the account behind it. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/fb @nestjs/axios
```

The manifest declares neither dependencies nor peer dependencies, and the package needs almost nothing: `@nestjs/common` for `@Injectable` and the `HttpService` of `@nestjs/axios` for the two requests. It imports no other `@smartsoft001` package, which is why it can be used on its own, outside the authentication stack it was written for.

## What it is

The Facebook half of social sign-in. A client that has already completed the Facebook login flow holds an access token but no identity your application can trust; this service exchanges that token for a Facebook user id by asking the Graph API who it belongs to. An invalid or expired token fails the request rather than returning an empty answer.

The package exports one class and nothing else. There is no config class, no injection token and no environment variable, because the only input is the token and it is an argument to each call. There is also no NestJS module here: `AuthShellNestjsModule.forRoot({ tokenConfig })` provides and exports `FbService` alongside `GoogleService`, so an application that imports the auth shell already has it. Register it by hand, as the example does, to use the Graph lookup without the rest of the authentication stack.

Inside that stack the service is called from one place. The token factory of [`@smartsoft001/auth-domain`](/docs/packages/auth-domain) sees a request whose `grant_type` is `fb`, calls `getUserId` with the `fb_token` from the request, and then looks the local user up by the `facebookUserId` column, so the Graph answer is what links a Facebook account to a user record.

## Usage

{% snippet file="node/src/fb/fb-service.example.ts" region="usage" /%}

The region wraps the package service in an application service rather than injecting it directly everywhere, which keeps the Graph call in one place, and registers both in a module that imports `HttpModule` for the `HttpService` the constructor asks for.

Its spec compiles that module with an `HttpService` stub that records the url and answers with a canned `{ data: { id: '42' } }`, and asserts three things. The call returns `42`, so the id is read from the `id` property of the answer. The url the service would have sent is exactly `https://graph.facebook.com/me?access_token=token`, which pins both the endpoint and the fact that the token travels as a query parameter rather than as a header. And the recorded list is still empty before any method has been called, so resolving the provider sends nothing.

## API

### `FbService`

Constructed as `new FbService(httpService)`, or resolved from the injector. `HttpService` is its only dependency.

| Method             | Returns                           | Request                                                                  |
| ------------------ | --------------------------------- | ------------------------------------------------------------------------ |
| `getUserId(token)` | `Promise<string>`, the `id` field | `GET https://graph.facebook.com/me?access_token={token}`                 |
| `getData(token)`   | `Promise<{ id; email }>`          | `GET https://graph.facebook.com/me?fields=email,id&access_token={token}` |

`getData` returns the Graph response body unchanged, so its two properties are whatever Facebook put there under those names. An account that has not granted the email permission answers without an `email`, and the call still succeeds.

Both methods let the underlying request error surface. There is no retry, no timeout of their own and no translation into a domain error, so an invalid token reaches the caller as the HTTP failure Facebook returned.

{% callout type="note" title="The token is sent in the query string" %}
Both requests put the access token in the url. That is what the Graph API accepts, but it means the token can appear in access logs, proxy logs and error reports that record full urls. Keep whatever logs these requests from recording query strings, and treat a captured url as a captured credential.
{% /callout %}

## Related packages

- [`@smartsoft001/auth-domain`](/docs/packages/auth-domain) calls `getUserId` from its token factory when a token request arrives with `grant_type: 'fb'`.
- [`@smartsoft001/auth-shell-nestjs`](/docs/packages/auth-shell-nestjs) provides and exports this service, so importing that module is the usual way to get it.
- [`@smartsoft001/google`](/docs/packages/google) is the same service for Google, exported from the same module and called from the same factory.

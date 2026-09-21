---
title: '@smartsoft001/auth-shell-app-services'
section: Packages
order: 18
package: '@smartsoft001/auth-shell-app-services'
nextjs:
  metadata:
    title: '@smartsoft001/auth-shell-app-services'
    description: 'AuthService: the one application service of the auth family, which resolves the three optional token providers out of the injector and delegates to TokenFactory.'
---

One service with one method: look the three optional token providers up in the injector, then hand the request to the factory. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/auth-shell-app-services @smartsoft001/auth-domain
```

[`@smartsoft001/auth-domain`](/docs/packages/auth-domain) is the only workspace package it imports, and the manifest declares it as a peer dependency pinned to its own version. Installing it pulls the rest of the chain into play, because the factory this service delegates to needs a TypeORM repository, a JWT service and the two social services.

Outside the workspace it needs `@nestjs/common` for `@Injectable` and `Logger`, `@nestjs/core` for `ModuleRef`, and the `express` types for the optional request object it forwards.

## What it is

The auth family keeps its decision in the domain and its wiring in the shell, and this package is the thin seam between them. `TokenFactory.create` accepts three optional providers as arguments and resolves none of them itself. Something has to look them up, and in a Nest application that something needs the injector. This service is it.

The lookup is deliberately lenient. Each of the three tokens is fetched with `moduleRef.get(token, { strict: false })`, so a provider registered anywhere in the application is found, not only in the module that declares this service. Nest throws when a token is unregistered, so each lookup sits in a try/catch that logs the message at debug level and returns `null`. An application that registers none of the three still issues tokens, and one that registers all three gets all three threaded through, with no configuration in between.

All three lookups run on every call, because the argument object is built before the factory is invoked. That is three injector queries per token request, and up to three caught exceptions when nothing is registered.

## Usage

{% snippet file="node/src/auth/auth-service.example.ts" region="usage" /%}

The region constructs the service by hand with a fake factory and a stub `ModuleRef`, which is all the class needs: in an application both arrive from [`@smartsoft001/auth-shell-nestjs`](/docs/packages/auth-shell-nestjs). The stub answers only for the tokens it was handed and throws for the rest, which is exactly what Nest does for a provider that was never registered. `requestToken` is the one call the token endpoint makes.

The spec covers the resolution in four passes. With an empty stub, the factory receives `{ httpReq, request, payloadProvider: null, validationProvider: null, userProvider: null }`, so the request and the Express object arrive untouched and each missing provider becomes `null` rather than an error. With only a payload provider registered, that instance reaches the factory by identity. With a validation provider and a user provider registered together, both come through while the payload provider stays `null`, which proves the three lookups are independent and that an omitted `httpReq` arrives as `undefined`. And the token the factory resolves is returned by identity, so the service adds nothing to it.

## API

### `AuthService`

`@Injectable()`. Two constructor parameters, both supplied by the injector in an application.

| Parameter   | Type           | What it is for                                             |
| ----------- | -------------- | ---------------------------------------------------------- |
| `factory`   | `TokenFactory` | The domain service that actually issues the token.         |
| `moduleRef` | `ModuleRef`    | The injector handle used for the three non-strict lookups. |

#### `create(req, httpReq?): Promise<IAuthToken>`

The only public method. `req` is the `IAuthTokenRequest` union from [`@smartsoft001/auth-domain`](/docs/packages/auth-domain) and `httpReq` is the Express request, forwarded so that a payload or user provider can read headers from it. The method resolves the three providers, calls `factory.create({ httpReq, request, payloadProvider, validationProvider, userProvider })` and returns its promise unchanged. It catches nothing, so every `DomainValidationError` the factory raises reaches the caller.

#### The three lookups

Private helpers, one per token, identical in shape: `moduleRef.get(token, { strict: false })` in a try, `Logger.debug(message, 'AuthService')` plus `null` in the catch.

| Token                            | Resolves to                | Effect when absent                                                                    |
| -------------------------------- | -------------------------- | ------------------------------------------------------------------------------------- |
| `AUTH_TOKEN_PAYLOAD_PROVIDER`    | `ITokenPayloadProvider`    | The JWT payload stays `{ permissions, scope }`.                                       |
| `AUTH_TOKEN_VALIDATION_PROVIDER` | `ITokenValidationProvider` | Only the built-in user, disabled and password checks run.                             |
| `AUTH_TOKEN_USER_PROVIDER`       | `ITokenUserProvider`       | The user comes from the repository, and an unknown grant type is rejected as invalid. |

All three contracts and tokens are defined in [`@smartsoft001/auth-domain`](/docs/packages/auth-domain), which documents what each one may change.

### `SERVICES`

`SERVICES` is `[AuthService]`, the provider array a Nest module spreads into its `providers` and `exports`, the same shape the CRUD and trans siblings export. `AuthShellNestjsModule` names `AuthService` directly rather than spreading the array, so nothing in the workspace depends on it yet, but it is part of the public API for an application that wires the service up itself.

## Related packages

- [`@smartsoft001/auth-domain`](/docs/packages/auth-domain) holds the factory, the request types and the three provider contracts.
- [`@smartsoft001/auth-shell-nestjs`](/docs/packages/auth-shell-nestjs) provides this service and exposes its one method as `POST /token`.
- [`@smartsoft001/auth-shell-dtos`](/docs/packages/auth-shell-dtos) is the form model behind a password grant.
- [`@smartsoft001/crud-shell-app-services`](/docs/packages/crud-shell-app-services) is the same layer in the CRUD family, where the rules live in the service rather than in the domain.

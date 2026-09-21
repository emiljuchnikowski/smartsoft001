---
title: '@smartsoft001/auth-shell-nestjs'
section: Packages
order: 19
package: '@smartsoft001/auth-shell-nestjs'
nextjs:
  metadata:
    title: '@smartsoft001/auth-shell-nestjs'
    description: 'The NestJS shell of the auth family: two dynamic modules and one route, POST /token, over TokenFactory and AuthService.'
---

Two dynamic modules and a single route: `POST /token`, wired to the factory that issues it. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/auth-shell-nestjs @smartsoft001/auth-domain @smartsoft001/auth-shell-app-services @smartsoft001/fb @smartsoft001/google
```

The manifest declares the four workspace packages above as peer dependencies, pinned to its own version, and they are all reached from the module file or the controller. The packages outside the workspace are not declared, so a missing one still shows up at import time rather than at install time.

The module's `imports` array is what decides the rest: `@nestjs/axios` for `HttpModule`, `@nestjs/typeorm` with `typeorm` for `forFeature(ENTITIES)`, `@nestjs/passport` with `passport` for the strategy registration, and `@nestjs/jwt` for the signing module. Add `@nestjs/common`, `@nestjs/core` and the `express` types, which the controller and the service use directly.

{% callout type="warning" title="It needs a TypeORM connection that it does not create" %}
Both modules import `TypeOrmModule.forFeature(ENTITIES)` and neither imports `forRoot`. Without a root connection registered elsewhere in the application, the `User` repository cannot be resolved and the module fails to compile. The usage section below shows the override that makes it testable.
{% /callout %}

## What it is

The decision lives in [`@smartsoft001/auth-domain`](/docs/packages/auth-domain) and the injector work in [`@smartsoft001/auth-shell-app-services`](/docs/packages/auth-shell-app-services). What is left is registration: bind the configuration as a provider, register the repository, Passport and the JWT module, and expose one endpoint. That is this package, and it is small enough to read in a minute.

There are two variants. `AuthShellNestjsModule.forRoot` is the complete one, with the controller and the two social services. `AuthShellNestjsCoreModule.forRoot` is for an application that owns its own transport, so it registers no controller and exports the service instead of the route.

Neither module registers a guard, and the token endpoint is unauthenticated by necessity: it is where a caller goes to get a token. The Passport registration here only sets `jwt` as the default strategy. The strategy class itself comes from [`@smartsoft001/nestjs`](/docs/packages/nestjs), and so do the guards protecting every other route in an application.

## Usage

### Register the token endpoint

{% snippet file="node/src/auth/auth-module.example.ts" region="usage" /%}

The region is the whole integration: import the dynamic module with a `tokenConfig` and the endpoint exists. The three fields are the signing key, the lifetime in seconds and the list of client ids the password grant will accept.

Its spec is where the interesting part is. It compiles the feature module with `Test.createTestingModule`, then calls `.overrideProvider(getRepositoryToken(User)).useValue({ findOne, update })` before `.compile()`, because the module asks for a `User` repository that no root connection provides. With the override in place, it resolves `TokenController` and `AuthService` and gets real instances of both, which proves the controller list and the provider list are wired as expected. The whole spec runs offline, with no database and no network.

That override is the pattern, not a trick of the test. An application either registers `TypeOrmModule.forRoot(...)` alongside this module, or supplies the repository token itself. There is no third option.

## API

### `AuthShellNestjsModule.forRoot(options)`

`options` is `{ tokenConfig: TokenConfig }`, the configuration class from [`@smartsoft001/auth-domain`](/docs/packages/auth-domain).

| Part          | Contents                                                                                                                                                 |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `controllers` | `TokenController`.                                                                                                                                       |
| `providers`   | `TokenConfig` as a value provider, `AuthService`, `FbService`, `GoogleService`, and `DOMAIN_SERVICES`, which is `TokenFactory`.                          |
| `imports`     | `HttpModule`, `TypeOrmModule.forFeature(ENTITIES)`, `PassportModule.register({ defaultStrategy: 'jwt', session: false })` and `JwtModule.register(...)`. |
| `exports`     | `FbService` and `GoogleService`, and nothing else.                                                                                                       |

`JwtModule.register` is handed `secret: tokenConfig.secretOrPrivateKey` and `signOptions.expiresIn: tokenConfig.expiredIn`, so the same configuration object drives both the signing module and the factory's own reporting of the lifetime.

The `exports` list is worth reading twice. Neither `AuthService` nor `TokenFactory` nor `TokenConfig` leaves this module, so an importing module gets the route and the two social services, not the token machinery. Use the core module when the application needs to issue a token from its own code.

### `AuthShellNestjsCoreModule.forRoot(options)`

The same options, a different set of trade-offs.

| Difference                      | What it means                                                                                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| No `controllers`                | No HTTP surface at all. The application exposes the token however it likes.                                                                     |
| No `HttpModule`                 | Nothing here needs an HTTP client, because the social services are absent.                                                                      |
| No `FbService`, `GoogleService` | They are not provided, yet `TokenFactory` asks for both in its constructor, so an application importing this module has to provide them itself. |
| Exports the machinery           | `AuthService`, `DOMAIN_SERVICES` and `TokenConfig` are all exported, so an importing module can inject them.                                    |

`TypeOrmModule.forFeature(ENTITIES)`, the Passport registration and `JwtModule.register(...)` are identical to the other variant, including the missing root connection.

The `DynamicModule` it returns sets `module: AuthShellNestjsCoreModule`, its own class, so the two variants are separate modules and an application can import either one.

### `TokenController`

Declared as `@Controller('token')`, with one handler.

| Route         | Guard | Handler                                                                                 |
| ------------- | ----- | --------------------------------------------------------------------------------------- |
| `POST /token` | none  | `create(@Body() req: IAuthTokenRequest, @Req() httpReq: Request): Promise<IAuthToken>`. |

It forwards both arguments to `AuthService.create` and returns the promise. There is no pipe and no validation at the edge: the body is typed as the request union but arrives unchecked, and every rule is applied by `TokenFactory`. A successful call answers with the JSON token, `{ access_token, refresh_token, expired_in, token_type, username }`.

A rejected call raises a `DomainValidationError`, which is a plain `Error` subclass, so Nest answers `500` unless the application maps it. Registering `AppExceptionFilter` from [`@smartsoft001/nestjs`](/docs/packages/nestjs) under `APP_FILTER` turns it into a `400` with `{ details: message }`, which is how the messages listed on the domain page reach a client.

### Exports

The barrel exports `TokenController`, `AuthShellNestjsModule` and `AuthShellNestjsCoreModule`. There are no guards, entities, DTOs or gateways of its own.

## Related packages

- [`@smartsoft001/auth-domain`](/docs/packages/auth-domain) supplies `TokenConfig`, `ENTITIES`, `DOMAIN_SERVICES` and the request types the route accepts.
- [`@smartsoft001/auth-shell-app-services`](/docs/packages/auth-shell-app-services) is the service the controller calls.
- [`@smartsoft001/auth-shell-dtos`](/docs/packages/auth-shell-dtos) is the form model a client fills before posting a password grant.
- [`@smartsoft001/nestjs`](/docs/packages/nestjs) supplies the JWT strategy, the guards for every other route and the filter that maps domain errors to status codes.
- [`@smartsoft001/users`](/docs/packages/users) declares the user interfaces the entity behind this module implements.
- [`@smartsoft001/crud-shell-nestjs`](/docs/packages/crud-shell-nestjs) is the sibling shell whose routes the tokens issued here unlock.

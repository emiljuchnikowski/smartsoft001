---
title: '@smartsoft001/nestjs'
section: Packages
order: 10
package: '@smartsoft001/nestjs'
nextjs:
  metadata:
    title: '@smartsoft001/nestjs'
    description: 'Shared NestJS building blocks: SharedModule with its JWT and permission configuration, PermissionService, the JWT strategy, the @User decorator and the application exception filter.'
---

The pieces every backend in this workspace repeats: one configurable module, the JWT strategy behind the guards, a permission check, a decorator that hands a handler its user, and a filter that turns domain errors into status codes. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/nestjs
```

## What it is

Authentication, authorisation and error shaping look the same in every service here, and all three need the same configuration. `SharedModule` carries that configuration, the signing key and the roles allowed to perform each operation, and provides the three things that read it. Everything else in the package hangs off that: the strategy validates a token with the key, the permission service checks a user against the roles, and the decorator hands the result to a controller.

The exception filter is the one part that stands on its own. It belongs here because the errors it translates come from the domain layer, which knows nothing about HTTP, so something has to map one onto the other at the edge.

The dependency footprint is worth knowing before you install: `@nestjs/testing` is declared as a runtime dependency of this package, not a development one, so it is installed into production alongside `@nestjs/common`, `@nestjs/passport` and `passport-jwt`.

## Usage

### Configure the module once

{% snippet file="node/src/getting-started/app-module.example.ts" region="usage" /%}

`forRoot` belongs in the application module and takes the database connection on top of the shared configuration. Its spec compiles the module and asserts two things: that `PermissionService` resolves, which proves the providers are exported to the importing module and not just declared, and that the `SharedConfig` it reads back carries the token lifetime that was passed in, which proves the configuration object survives as the injectable value rather than being copied or rebuilt.

A feature module that should reuse the same configuration imports `SharedModule.forFeature` with the same object instead, which registers the identical providers without the database settings.

### Guard an operation with a permission

{% snippet file="node/src/nestjs/permission-service.example.ts" region="usage" /%}

`valid` does not return a verdict, it either passes or throws, which is why the check reads as one line at the top of a method rather than as a branch around its body.

Its spec builds a testing module with a stub `SharedConfig` whose `read` list holds `admin` and `user`. A user holding `user` gets the reports back; a user holding only `guest` makes the same call throw `DomainForbiddenError`. Both assertions run against the real service, so what is proved is the matching rule itself: any single overlap between the user's permissions and the configured list is enough.

### Translate domain errors into responses

{% snippet file="node/src/nestjs/exception-filter.example.ts" region="usage" /%}

Registering the filter under the `APP_FILTER` token makes it global without touching the bootstrap file, and lets Nest construct it through the injector.

The spec checks the registration and then the behaviour. It reads the provider metadata back off the module to confirm the binding, then calls `catch` directly with a fake `ArgumentsHost` and a stub response. A `DomainValidationError` produces status 400 and a `DomainForbiddenError` produces 403, and in both cases the body is the error's own message under a `details` key. Calling the filter directly is the point: no HTTP server is started, so the test stays a unit test while still covering the exact mapping a client sees.

## API

### `SharedModule`

Two static factories returning a `DynamicModule`. Both provide and export `SharedConfig` as a value, `JwtStrategy` and `PermissionService`.

| Factory                   | Signature                                                                                                                                       | Use it                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `SharedModule.forRoot`    | `forRoot(config: SharedConfig & { db: { host: string; port: number; database: string; username?: string; password?: string } }): DynamicModule` | Once, in the application module. It adds the database settings and re-exports `forFeature`. |
| `SharedModule.forFeature` | `forFeature(config: SharedConfig): DynamicModule`                                                                                               | In a feature module that needs the same configuration without the database settings.        |

### `SharedConfig`

An `@Injectable()` class used as the injection token for the configuration.

| Field         | Type                                                | What it does                                                                                                                                                                      |
| ------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokenConfig` | `{ secretOrPrivateKey: string; expiredIn: number }` | `secretOrPrivateKey` is the key `JwtStrategy` verifies tokens with. `expiredIn` is the lifetime in seconds the token-issuing packages sign with; this package only reads the key. |
| `permissions` | `ISharedPermissions`                                | Maps `create`, `read`, `update` and `delete`, plus any other operation name, to the list of role names allowed to perform it.                                                     |
| `type`        | `any`                                               | An optional model type carried for the packages built on top of this module.                                                                                                      |

`PermissionType` is the type of the first argument of `valid`: `'create' | 'read' | 'update' | 'delete'`, widened to `string` so an application can name its own operations.

### `PermissionService`

`valid(type: PermissionType, user: IUser): void`, and nothing else. It throws `DomainForbiddenError` with the message `Context forbidden`, and returns silently in every other case.

| Situation                                          | Outcome                                                               |
| -------------------------------------------------- | --------------------------------------------------------------------- |
| No `permissions` configured at all                 | Passes. Nothing has been restricted.                                  |
| Nothing configured for this `type`                 | Passes. Only named operations are restricted.                         |
| The user has no `permissions`                      | Throws `DomainForbiddenError`.                                        |
| None of the user's permissions appears in the list | Throws `DomainForbiddenError`.                                        |
| At least one appears                               | Passes. One overlap is enough, the list is not a set of requirements. |

### `JwtStrategy`

A passport strategy over `passport-jwt`, provided by both module factories. It reads the token from the `Authorization` header as a bearer token, verifies it with `tokenConfig.secretOrPrivateKey` and rejects expired tokens. Its `validate` returns the claims of the payload with `username` set from the `sub` claim, and that object is what the request carries from then on.

### `User`

A `createParamDecorator` that returns `req.user`, the object `JwtStrategy.validate` produced. Declare the parameter as `IUser` from [@smartsoft001/users](/docs/packages/users) in the handler that uses it.

### `AppExceptionFilter`

A `@Catch()` filter, so it sees every exception. It logs the stack and then answers with a status and a body of `{ details: message }`.

| Exception                 | Status                      | `details`               |
| ------------------------- | --------------------------- | ----------------------- |
| An `HttpException`        | the exception's own status  | the exception's message |
| A `DomainValidationError` | `400 Bad Request`           | the error's message     |
| A `DomainForbiddenError`  | `403 Forbidden`             | the error's message     |
| Anything else             | `500 Internal Server Error` | `Internal server error` |

The two domain errors are recognised by their `type` property rather than by `instanceof`, which is what keeps the mapping working across package boundaries. Register the filter with `APP_FILTER` as shown above.

## Related packages

- [@smartsoft001/users](/docs/packages/users) defines the `IUser` the permission service and the decorator work with.
- [@smartsoft001/domain-core](/docs/packages/domain-core) raises the two errors the filter translates.
- [@smartsoft001/mongo](/docs/packages/mongo) stores the data the guarded endpoints serve.
- [Installation](/docs/installation) shows the module wired into a fresh NestJS project.

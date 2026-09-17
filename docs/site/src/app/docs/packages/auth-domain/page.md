---
title: '@smartsoft001/auth-domain'
section: Packages
order: 16
package: '@smartsoft001/auth-domain'
nextjs:
  metadata:
    title: '@smartsoft001/auth-domain'
    description: 'The token-issuing domain: the User entity, TokenFactory and its four grants, the token configuration and the three provider extension points.'
---

One factory that turns a token request into a signed bearer token, across four grant types, with three points where an application can take the decision over. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/auth-domain @smartsoft001/domain-core @smartsoft001/fb @smartsoft001/google @smartsoft001/users @smartsoft001/utils
```

The manifest declares neither dependencies nor peer dependencies, so every import has to be installed next to it. The five workspace packages above are all reached directly: `domain-core` for the factory contract and the validation error, [`@smartsoft001/users`](/docs/packages/users) for the two interfaces the entity implements, [`@smartsoft001/utils`](/docs/packages/utils) for the password comparison, and the Facebook and Google services for the two social grants.

From outside the workspace it needs `typeorm` for the entity decorators and the repository type, `@nestjs/typeorm` for `@InjectRepository`, `@nestjs/common` for `@Injectable`, `@nestjs/jwt` for the service that signs the access token, `guid-typescript` for the refresh token, and the `express` types for the optional request object. `FbService` and `GoogleService` are built on `@nestjs/axios`, so that comes along with them.

## What it is

This is the whole authentication decision, with no transport attached. `TokenFactory.create` receives a request object shaped like an OAuth token request, finds the matching user, checks that the user may log in, rotates the refresh token and returns a signed access token. A REST controller, a scheduled job or a test can all call it the same way, and [`@smartsoft001/auth-shell-nestjs`](/docs/packages/auth-shell-nestjs) is only the HTTP wrapper around it.

Four grant types are built in. `password` matches a username and a hashed password, `refresh_token` matches a previously issued refresh token, and `fb` and `google` exchange a social access token for the provider's user id and match on that. Only the two social grants leave the process, and only to ask Facebook or Google who the token belongs to. The password and refresh-token grants are entirely offline, which is why the examples below run with nothing but an array and a stub.

Anything the built-in flow does not cover is an extension point rather than a fork. Three abstract classes, each with a string injection token, let an application supply the user itself, add claims to the payload, or replace the validation altogether. The factory resolves none of them; it takes whichever ones the caller passes, and [`@smartsoft001/auth-shell-app-services`](/docs/packages/auth-shell-app-services) is what looks them up in the injector.

## Usage

### Which column a grant looks up

{% snippet file="node/src/auth/token-query.example.ts" region="usage" /%}

The region wraps the static `TokenFactory.getQuery`, the one part of the factory that needs no injector, no database and no network. Its first parameter is named `config` in the source, but it is the token request: each grant type selects a different column of the `users` table. The second says whether an `ITokenUserProvider` is registered, which changes what an unrecognised grant type means.

Its spec walks all four grants and both unknown-grant outcomes. A password request yields `{ username: 'anna' }`, a refresh-token request `{ authRefreshToken: 'c0ffee' }`, and the two social requests `{ facebookUserId: 'fb-42' }` and `{ googleUserId: 'google-42' }`. An unrecognised `grant_type` throws `DomainValidationError('Invalid grand type')`, the typo included, and the same request with the provider flag set returns `null` instead, because a user provider is expected to resolve the user without a query.

The two social cases in the spec also show a wrinkle of the types. `IAuthTokenRequestFb` and `IAuthTokenRequestGoogle` both extend `IUserCredentials`, so the compiler insists on `username` and `password` even though neither grant reads them, and the spec has to pass empty strings to satisfy it.

### The password grant end to end

{% snippet file="node/src/auth/password-grant.example.ts" region="usage" /%}

The region builds a working factory by hand: a `TokenConfig` whose `clients` list holds the one client id, an array-backed stand-in for the TypeORM repository, a `JwtService` stub that always signs `'signed.jwt'`, and empty objects for the Facebook and Google services, which the password grant never touches. The stored user's password is put through `PasswordService.hash`, so the comparison the factory runs is the real one.

The fake repository has to understand two query shapes, and that is a fact about the factory rather than about the example. Lookups arrive as a plain entity partial, but the update criteria arrive as `{ ...query, disabled: { $ne: true } }`, a Mongo operator mixed into what TypeORM types as a `Partial<User>`.

Its spec covers the happy path and every refusal. A valid request comes back with `token_type: 'bearer'`, the `expired_in` from the config, and the `access_token` the stub signed. The stored user ends up carrying the refresh token that was returned and a `lastLoginDate`, which proves the rotation was persisted rather than only reported. The returned object has no `password` key. And four requests are rejected with the exact messages the factory raises: a wrong password and an unknown username both produce `Invalid username or password`, an unregistered client id produces `client_id is incorrect`, and a user flagged `disabled` produces `user disabled`.

{% callout type="warning" title="The password check is md5" %}
`checkPassword` calls `PasswordService.compare` from [`@smartsoft001/utils`](/docs/packages/utils), which hashes the candidate with unsalted md5 and compares the strings. That is the warning on that package's page, and it applies to every credential this factory verifies.
{% /callout %}

## API

### `User`

A TypeORM `@Entity('users')` implementing `IEntity<string>` from `@smartsoft001/domain-core` and both `IUser` and `IUserCredentials` from [`@smartsoft001/users`](/docs/packages/users).

| Column             | Type            | What it holds                                                                               |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------- |
| `id`               | `string`        | `@PrimaryGeneratedColumn()`.                                                                |
| `username`         | `string`        | What the password grant looks up.                                                           |
| `password`         | `string`        | The stored digest, never the clear text.                                                    |
| `permissions`      | `Array<string>` | Copied into the JWT payload, and what the permission checks elsewhere read.                 |
| `disabled`         | `boolean`       | A truthy value refuses every grant and also excludes the row from the refresh-token update. |
| `lastLoginDate`    | `Date`          | Stamped on every successful token request.                                                  |
| `authRefreshToken` | `string`        | The current refresh token. Replaced on every successful token request.                      |
| `facebookUserId`   | `string?`       | What the `fb` grant looks up.                                                               |
| `googleUserId`     | `string?`       | What the `google` grant looks up.                                                           |

### `TokenFactory`

`@Injectable()`, and an `IFactory<IAuthToken, ...>` from `@smartsoft001/domain-core`. Its five constructor parameters are all resolved by the Nest module in a real application.

| Parameter       | Type               | Why it is there                                                                |
| --------------- | ------------------ | ------------------------------------------------------------------------------ |
| `config`        | `TokenConfig`      | The lifetime, the signing key and the list of accepted client ids.             |
| `repository`    | `Repository<User>` | Injected with `@InjectRepository(User)`. Only `findOne` and `update` are used. |
| `jwtService`    | `JwtService`       | Signs the access token.                                                        |
| `fbService`     | `FbService`        | Exchanges a Facebook token for a user id. Used only by the `fb` grant.         |
| `googleService` | `GoogleService`    | The same for Google. Used only by the `google` grant.                          |

#### `create(options): Promise<IAuthToken>`

`options` is `{ httpReq?, request, payloadProvider?, validationProvider?, userProvider? }`, and the method runs in a fixed order.

| Step | What happens                                                                                                                                                            |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | For `fb` and `google`, the social token is exchanged for a user id, which is written back onto the request. This is the only outbound call.                             |
| 2    | The request is validated by shape. An empty request, a missing `grant_type`, a missing field of the grant, or a `client_id` outside `config.clients` throws.            |
| 3    | `getQuery` builds the lookup, and the user is fetched from `userProvider.get(...)` when one was passed and from the repository otherwise.                               |
| 4    | Unless a validation provider sets `replace`, the user must exist, must not be disabled, and for the password grant must match the stored digest.                        |
| 5    | A validation provider, if present, runs its own `check({ request, user })`.                                                                                             |
| 6    | A fresh GUID becomes the refresh token, and the matching row is updated with it and with `lastLoginDate`.                                                               |
| 7    | The payload `{ permissions, scope }` is built, handed to a payload provider if one was passed, and signed with `expiresIn` from the config and the username as subject. |

The resolved value is `{ expired_in, token_type: 'bearer', access_token, refresh_token, username }`.

Two of those steps deserve a second look. A validation provider with `replace: true` skips step 4 entirely, and nothing else checks that a user was found, so a provider that takes the decision over must also guarantee a user. And the update in step 6 uses `{ ...query, disabled: { $ne: true } }`, so the criteria object the repository receives is a TypeORM entity partial with one Mongo operator inside it.

#### Statics

| Member                                      | Returns         | Behaviour                                                                                                                                       |
| ------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `getQuery(request, customProvider = false)` | `Partial<User>` | The column lookup for the grant. An unknown grant throws `DomainValidationError('Invalid grand type')`, or returns `null` when the flag is set. |
| `checkDisabled(user)`                       | `void`          | Throws `DomainValidationError('user disabled')` when `user.disabled` is truthy.                                                                 |

The first parameter of `getQuery` is declared as `config: IAuthTokenRequest`. The name is misleading and the type is right: it is the request.

#### The messages it throws

Every failure is a `DomainValidationError` from `@smartsoft001/domain-core`.

| Message                                                                                        | When                                                                              |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `config is empty`                                                                              | No request at all.                                                                |
| `grant_type is empty`                                                                          | A request without a grant type.                                                   |
| `username is empty`, `password is empty`, `client_id is empty`                                 | The password grant with that field missing.                                       |
| `client_id is incorrect`                                                                       | The client id is not in `TokenConfig.clients`.                                    |
| `refresh_token is empty`                                                                       | The refresh-token grant without its token.                                        |
| `fb_token is empty`, `fb_user_id is empty`, `google_token is empty`, `google_user_id is empty` | The social grants, checked after the provider lookup.                             |
| `Invalid grand type`                                                                           | An unrecognised grant type with no user provider.                                 |
| `Invalid username or password`                                                                 | The password grant with no matching user, or with a password that does not match. |
| `Invalid token`                                                                                | Any other grant whose lookup found no user.                                       |
| `user disabled`                                                                                | The user exists but is flagged disabled.                                          |

A wrong password and an unknown username are deliberately indistinguishable.

### `TokenConfig`

An `@Injectable()` class with three fields, registered by the shell module as a value provider.

| Field                | Type            | What it does                                                                     |
| -------------------- | --------------- | -------------------------------------------------------------------------------- |
| `secretOrPrivateKey` | `string`        | The JWT signing key. The module also hands it to `JwtModule.register`.           |
| `expiredIn`          | `number`        | The lifetime, reported as `expired_in` and passed to the signer as `expiresIn`.  |
| `clients`            | `Array<string>` | Accepted client ids, empty by default. Only the password grant checks this list. |

### Extension points

Each is an abstract class plus a string constant used as an injection token. Implement the class, register it under the token, and `AuthService` finds it.

| Token                            | Contract                                                                        | What it can change                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `AUTH_TOKEN_USER_PROVIDER`       | `ITokenUserProvider.get(baseQuery, request, httpReq?): Promise<User>`           | Where the user comes from. Its presence also makes an unknown grant type legal.                |
| `AUTH_TOKEN_PAYLOAD_PROVIDER`    | `ITokenPayloadProvider.change(basePayload, { request?, user?, httpReq? })`      | The JWT claims. It mutates the payload object in place before signing.                         |
| `AUTH_TOKEN_VALIDATION_PROVIDER` | `ITokenValidationProvider.check({ request?, user? })`, plus `replace?: boolean` | Extra rules, or with `replace: true` the built-in user, disabled and password checks entirely. |

### Request and response types

| Type                            | Shape                                                                                                                 |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `IAuthTokenRequestPassword`     | `grant_type: 'password'` with `username`, `password`, `client_id` and an optional `scope`.                            |
| `IAuthTokenRequestRefreshToken` | `grant_type: 'refresh_token'` with `refresh_token` and an optional `scope`. No `client_id`.                           |
| `IAuthTokenRequestFb`           | `grant_type: 'fb'` with `fb_token`, `client_id`, optional `fb_user_id` and `scope`.                                   |
| `IAuthTokenRequestGoogle`       | `grant_type: 'google'` with `google_token`, `client_id`, optional `google_user_id` and `scope`.                       |
| `IAuthTokenRequestCustom`       | `grant_type: string` with an index signature of strings. The escape hatch for a user provider.                        |
| `IAuthTokenRequest`             | The union of the five. It is not discriminated cleanly, because the custom member's `grant_type` is a plain `string`. |
| `IAuthToken`                    | `{ access_token, refresh_token, expired_in, token_type: 'bearer', username? }`. `create` always fills `username`.     |

The two social interfaces extend `IUserCredentials`, which means the compiler demands `username` and `password` on requests that ignore both. Callers end up passing empty strings, as the spec does.

### Provider arrays

`DOMAIN_SERVICES` is `[TokenFactory]` and `ENTITIES` is `[User]`. A Nest module spreads the first into its providers and hands the second to `TypeOrmModule.forFeature`, which is exactly what [`@smartsoft001/auth-shell-nestjs`](/docs/packages/auth-shell-nestjs) does.

## Related packages

- [`@smartsoft001/auth-shell-nestjs`](/docs/packages/auth-shell-nestjs) registers this factory and exposes it as `POST /token`.
- [`@smartsoft001/auth-shell-app-services`](/docs/packages/auth-shell-app-services) resolves the three extension points and calls `create`.
- [`@smartsoft001/domain-core`](/docs/packages/domain-core) declares `IFactory`, `IEntity` and the error every refusal raises.
- [`@smartsoft001/users`](/docs/packages/users) declares the two interfaces the `User` entity implements.
- [`@smartsoft001/utils`](/docs/packages/utils) supplies the password hashing, and the warning that comes with it.
- [`@smartsoft001/auth-shell-dtos`](/docs/packages/auth-shell-dtos) is the login form model on the other side of the request.

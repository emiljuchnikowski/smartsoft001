---
title: '@smartsoft001/users'
section: Packages
order: 4
package: '@smartsoft001/users'
nextjs:
  metadata:
    title: '@smartsoft001/users'
    description: 'The two interfaces that describe who is acting: IUser, carried through every permission check and repository call, and IUserCredentials, the sign-in payload.'
---

Two interfaces that describe who is acting, shared by the authentication, repository and CRUD packages so they all mean the same thing by "user". {% .lead %}

---

## Install

```bash
npm install @smartsoft001/users
```

## What it is

The packages in this workspace pass a user around constantly: repositories stamp it onto the records they write, the permission service reads its roles, and the JWT strategy produces it from a token. If each of them declared its own shape, none of them could be combined without an adapter, so the shape lives here instead, in a package that depends on nothing.

There is no runtime code at all. `IUser` and `IUserCredentials` are interfaces, erased when TypeScript compiles, so the dependency exists at build time and disappears from the bundle. That also means there is nothing here to test in the usual sense: what the example below checks is that the declarations resolve and that a value written against them typechecks.

## Usage

{% snippet file="node/src/users/user.example.ts" region="usage" /%}

The fixture is the whole surface. `adminUser` is what a request handler receives once a token has been validated, and `credentials` is what a client posts to obtain that token in the first place.

Its spec asserts the permission names, the scope and that the credentials sign in under the same username, and it declares both fixtures against the interfaces a second time inside the test. Those assertions are cheap on purpose. The proof they carry is the compilation itself: the example imports from `@smartsoft001/users` through the published entry point, so if the interfaces were renamed, dropped from the package index or given different members, the example would stop building before any assertion ran.

## API

### `IUser`

The identity every other package accepts.

| Property      | Type            | Required | What it holds                                                                                                                 |
| ------------- | --------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `username`    | `string`        | yes      | The identifier the user signs in with. The JWT strategy fills it from the `sub` claim of the token.                           |
| `permissions` | `Array<string>` | yes      | The role names this user holds. `PermissionService` matches them against the lists configured on `SharedModule`.              |
| `scope`       | `string`        | no       | An optional tenant or application scope, used to keep the records of separate deployments apart when they share one database. |

### `IUserCredentials`

The sign-in payload, and nothing more. It has no relation to `IUser` in the type system, so a credentials object is never accidentally accepted where an identity is expected.

| Property   | Type     | Required | What it holds                                             |
| ---------- | -------- | -------- | --------------------------------------------------------- |
| `username` | `string` | yes      | The same identifier that ends up on `IUser.username`.     |
| `password` | `string` | yes      | The plain password, sent once to exchange it for a token. |

### Where the interfaces are consumed

| Consumer                              | How it uses `IUser`                                                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `PermissionService.valid(type, user)` | Reads `permissions` and throws when none of them appears in the list configured for that operation.          |
| `@User()` param decorator             | Returns the user the JWT strategy attached to the request, typed as `IUser` by the handler that declares it. |
| `IItemRepository` write methods       | Take the acting user so the implementation can record who created or changed a record.                       |

## Related packages

- [@smartsoft001/nestjs](/docs/packages/nestjs) turns a token into an `IUser` and checks its permissions.
- [@smartsoft001/domain-core](/docs/packages/domain-core) takes an `IUser` on every repository write.
- [@smartsoft001/mongo](/docs/packages/mongo) is the implementation that stores it alongside the record.
